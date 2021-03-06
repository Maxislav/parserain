const port = 8084;
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
server.listen(port, ()=>{
	console.log(`Server start on port ${port}`)
});


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
			setTimeout(() => {
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
					});

					/**
					 * Удаление мусора
					 */
					for(let x = 20; x<26; x++){
						for(let y = 460; y<480;y++){
							imageMatrix[x][y] =  new ImageColor(204, 204, 204, 244);
						}
					}

					resolve({
						direction : imageMatrix.getDirection(),
						dist: imageMatrix.distByLatLng({lat: parseFloat(lat), lng: parseFloat(lng)}) ,
						isRainy: imageMatrix.isRainy()
					})

					imageMatrix.clear();
					delete imageMatrix;

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
			const i = hashDate[currentHash].i;
			let ip =  req.headers['x-forwarded-for'] ||
				req.connection.remoteAddress ||
				req.socket.remoteAddress ||
				req.connection.socket.remoteAddress;

			ip = ip.replace(/::f+:/, '');
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(result, null, 3));



			console.log('resolve ->', i, 'ip:', ip, {direction:result.direction, dist: result.dist.length? result.dist[0] :[], isRainy: result.isRainy })
		})
		.catch(err => {
			res.status(500).send({error: 'meteoinfo error'});
		})


});