const express = require('express');
const app = express();
const url = require('url');
const Jimp = require('jimp');
const ImageMatrix = require('./src/classes/ImageMatrix.class');
const ImageColor = require('./src/classes/ImageColor.class');
const {getDirection} = require('./src/get-direction');
const MathDate = require('./src/classes/MathDate');

const server = require('http').Server(app);
server.listen(8084);


//const path = 'http://meteoinfo.by/radar/UKBB/UKBB_latest.png';
const path = 'http://localhost:8030/borispol-radar2/src/img/meteoradar_borispol.png';
const mathDate = new MathDate();

const hashDate = {};




let timeoutClearHasId = 0;

app.get('/parserain', (req, res, next) => {
	const url_parts = url.parse(req.url, true);
	/**
	 * @type {{lat:number|undefined, lng:number|undefined }}
	 */
	const query = url_parts.query;
	const currentHash = mathDate.getCurrentDate().toISOString() +'.' + query.lat+ '.' +query.lng;

	timeoutClearHasId && clearTimeout(timeoutClearHasId);
	timeoutClearHasId = setTimeout(()=>{
		for(let key in hashDate){
			delete hashDate[key]
		}
		console.log('clear hash ->')
	}, 60000);

	if(!hashDate[currentHash]){
		hashDate[currentHash] = new Promise((resolve, rej)=>{
			Jimp.read(path, function (err, image) {
				if (err) {
					console.error('meteoinfo error->', err);
					rej(err);
					return;
				}
				const imageMatrix = new ImageMatrix();
				image.crop(0, 0, 505, 480);
				image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
					if (!imageMatrix[x]) imageMatrix[x] = [];
					const red = image.bitmap.data[idx];
					const green = image.bitmap.data[idx + 1];
					const blue = image.bitmap.data[idx + 2];
					const alpha = image.bitmap.data[idx + 3];
					const imageColor = new ImageColor(red, green, blue, alpha);
					imageMatrix[x][y] = imageColor;
					imageMatrix[x][y] = imageColor;
				});
				const direction = getDirection(imageMatrix)
				resolve(direction ? ''+direction : null)
			})
		})
	}
	hashDate[currentHash].then(direction=>{
		res.end(direction)
	})
		.catch(err=>{
			res.status(500).send({error: 'meteoinfo error'});
		})




});