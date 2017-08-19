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
		this.hex = ImageColor._toHex(...args)
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
		if (r > 255 || g > 255 || b > 255 || a > 255)
			throw "Invalid color component";
		return (256 + r).toString(16).substr(1) + ((1 << 24) + (g << 16) | (b << 8) | a).toString(16).substr(1);
	}

}

module.exports = ImageColor;