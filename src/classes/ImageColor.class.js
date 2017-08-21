/**
 *
 * @extends Array
 */
class ImageColor extends Array {

	/**
	 * @param {...number} args
	 */
	constructor(...args) {
		super(...args);
		this.r = args[0];
		this.g = args[1];
		this.b = args[2];
		this.a = args[3];
		/**
		 * @type {string}
		 */
		this.hex = ImageColor._toHex(...args);
		this.dec = parseInt(this.hex, 16);

		this.x = null;
		this.y = null;
		this.dist = null;
		this.intensity = null;
		this.text = null;

	}

	distFrom(x, y){
		const X = Math.abs(x-this.x);
		const Y = Math.abs(y-this.y);
		this.dist = Math.pow( Math.pow(X, 2)+ Math.pow(Y, 2), 1/2)*(400/470);
		return this.dist
	}


	setDistFrom(x, y){
		return this.distFrom(x, y)
	}

	/**
	 *
	 * @param {number} r
	 * @param {number} g
	 * @param {number} b
	 * @param {number} a
	 * @return {string}
	 * @private
	 */
	static _toHex(r, g, b, a) {
		let hex = '';
		new Array(...arguments).forEach((color, i)=>{
			if(i<3){
				let c = color.toString(16);
				if (c.length<2) c = '0'+c;
				hex+=c
			}
		});
		return hex;
	}

}

module.exports = ImageColor;