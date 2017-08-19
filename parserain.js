const express = require('express');
const app = express();
const url = require('url');
const Jimp = require('jimp');
const ImageMatrix = require('./src/classes/ImageMatrix.class');
const ImageColor = require('./src/classes/ImageColor.class');
const {getDirection} = require('./src/get-direction');

const server = require('http').Server(app);
server.listen(8084);


const path = 'http://meteoinfo.by/radar/UKBB/UKBB_latest.png';





app.get('/parserain', (req, res, next) => {
	const url_parts = url.parse(req.url, true);
	const query = url_parts.query;

	Jimp.read(path, function (err, image) {
		if (err) {
			console.error('meteoinfo error->', err);
			res.status(500).send({error: 'meteoinfo error'});
			return;
		}

		const imageMatrix = new ImageMatrix();
		image.crop(5, 5, 500, 475);
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

		res.end(direction)
	})


});