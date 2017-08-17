const express = require('express');
const app = express();
const url = require('url');
const Jimp = require('jimp');

const server = require('http').Server(app);
server.listen(8084);


const path = 'http://meteoinfo.by/radar/UKBB/UKBB_latest.png';

class Color extends Array{
	constructor(...args){
		super(...args);
		this.r = args[0];
		this.g = args[1];
		this.b = args[2];
		this.a = args[3];
		this.hex = Color._toHex(...args)

	}

	static _toHex(r, g, b, a){
			if (r > 255 || g > 255 || b > 255 || a > 255)
				throw "Invalid color component";
			return (256 + r).toString(16).substr(1) +((1 << 24) + (g << 16) | (b << 8) | a).toString(16).substr(1);
	}

}


app.get('/parserain', (req, res, next)=>{
	const url_parts = url.parse(req.url, true);
	const query = url_parts.query;

	Jimp.read(path, function (err, image) {
		if (err) {
			console.error('meteoinfo error->', err);
			res.status(500).send({error: 'meteoinfo error'});
			return;
		}
		image.crop(5, 5, 500, 475);
		image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
			const red = image.bitmap.data[idx];
			const green = image.bitmap.data[idx + 1];
			const blue = image.bitmap.data[idx + 2];
			const alpha = image.bitmap.data[idx + 3];
			const color = new Color(red, green, blue, alpha);
		});
		res.end('hello')
	})




});