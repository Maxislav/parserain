const express = require('express');
const app = express();
const url = require('url');
const Jimp = require('jimp');
const ImageMatrix = require('./src/classes/ImageMatrix.class');
const ImageColor = require('./src/classes/ImageColor.class');
const {getDirection} = require('./src/get-direction');
const MathDate = require('./src/classes/MathDate');
const Deferred = require('./src/classes/DeferClass');
const server = require('http').Server(app);
server.listen(8084);


const path = 'http://meteoinfo.by/radar/UKBB/UKBB_latest.png';
//const path = 'http://localhost:8030/borispol-radar2/src/img/meteoradar_borispol.png';
//const path = 'http://localhost:8030/parserain/urbb_debug.jpg';
const mathDate = new MathDate();

const hashDate = {};


let timeoutClearHasId = 0;
let I = 0;
app.get('/parserain', (req, res, next) => {

	I++;

	console.log(I)
	const url_parts = url.parse(req.url, true);
	/**
	 * @type {{lat:number|undefined, lng:number|undefined }}
	 */
	const query = url_parts.query;
	const currentHash = mathDate.getCurrentDate().toISOString() + '.' + query.lat + '.' + query.lng;


	const {lat = 50.44701, lng = 30.49} = query;


	timeoutClearHasId && clearTimeout(timeoutClearHasId);
	timeoutClearHasId = setTimeout(() => {
		for (let key in hashDate) {
			delete hashDate[key]
		}
		console.log('clear hash ->', new Date().toISOString())
	}, 60000);

	if (!hashDate[currentHash]) {
		hashDate[currentHash] = new Deferred(I);
		new Promise((resolve, rej) => {
        setTimeout(()=>{
			Jimp.read(path, function (err, image) {
				if (err) {
					console.error('meteoinfo error->', err);
					rej(err);
					return;
				}

				image.crop(0, 0, 505, 480);
				const imageMatrix = new ImageMatrix(image.bitmap.width, image.bitmap.height);
				image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
					const red = image.bitmap.data[idx];
					const green = image.bitmap.data[idx + 1];
					const blue = image.bitmap.data[idx + 2];
					const alpha = image.bitmap.data[idx + 3];
					const imageColor = new ImageColor(red, green, blue, alpha);
					imageColor.x = x;
					imageColor.y = y;
					imageMatrix[x][y] = imageColor;
					imageMatrix[x][y] = imageColor;
				});


				const direction = getDirection(imageMatrix);
				console.log('direction ->', direction)
				const dist = imageMatrix.distByLatLng({lat: parseFloat(lat), lng: parseFloat(lng)}, direction + 180);
				resolve({
					direction,
					dist: dist,
					isRainy: imageMatrix.isRainy()
				})
			})
        }, 20)

			
		})
			.then(res => {
				hashDate[currentHash].resolve(res)

			})
	}
	return hashDate[currentHash]
		.promise
		.then(result => {
			const  i = hashDate[currentHash].i;
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(result, null, 3));
			console.log('resolve ->',  i,  result)
		})
		.catch(err => {
			res.status(500).send({error: 'meteoinfo error'});
		})


});