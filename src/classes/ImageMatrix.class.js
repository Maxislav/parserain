const constantRadarColor = require('../color.constant')
const MyMath = require('../MyMath');
/**
 * @extends Array
 */
class ImageMatrix extends Array {
	/**
	 *
	 * @param {number}width ширина картинки
	 * @param {number}height высота картинки
	 */
	constructor(width, height) {
		super();
		this._width = width;
		this._height = height;
		this._scale = 420 / height;
		/**
		 * @type {number|null}
		 * @private
		 */
		this._direction = null;

		for (let x = 0; x < this._width; x++) {
			if (!this[x]) this[x] = [];
		}
		this.list = null;


	}

	/**
	 *
	 * @param {number|null}direction
	 * @return {ImageMatrix}
	 */
	setDirection(direction) {
		this._direction = direction;
		return this;
	}

	toArray() {
		if (!this.list) {
			this.list = [];
			for (let x = 0; x < this._width; x++) {
				for (let y = 0; y < this._height; y++) {
					this.list.push(this[x][y])
				}
			}
		}
		return this.list;
	}


	dist(original, a) {
		let rain = this.toArray();


		if (a) {
			a = MyMath.normalizeDegree(a);
			const {x, y} = original;
			rain = rain.filter(p => {
				let _a;
				if (x < p.x && p.y < y) {
					_a = (Math.atan((p.x - x) / (y - p.y)))
				} else if (x < p.x && y < p.y) {
					_a = (Math.atan((p.y - y) / (p.x - x))) + Math.PI / 2
				} else if (p.x < x && y < p.y) {
					_a = (Math.atan((x - p.x) / (p.y - y))) + Math.PI
				} else {
					_a = (Math.atan((y - p.y ) / (x - p.x))) + 3 * Math.PI / 2
				}
				_a = MyMath.degrees(_a);
				return Math.abs(a - _a) < 15
			})
		}

		const filterByColor = rain.filter((item) => {
			return constantRadarColor.find((val) => {
				const find = Math.abs(item.dec - val.colorDec) < 1000;
				if (find) {
					item.text = val.text
				}
				return find
			});
		});

		filterByColor.forEach(r => {
			r.setDistFrom(original.x, original.y)
		});

		filterByColor.sort((a, b) => {
			if (a.dist < b.dist) {
				return -1
			}
			if (b.dist < a.dist) {
				return 1
			}
			if (a.dist == b.dist) {
				return 0
			}
		});

		const colors = [];


		return filterByColor
			.filter(function (value, index, arr) {
				const find = colors.find((val) => {
					return Math.abs(value.dec - val) < 10
				});
				if (!find && (100 < value.r || 100 < value.g || 100 < value.b )) {
					colors.push(value.dec);
					return true
				}
				return false
			})
			.map(it => {
				return {
					dist: it.dist,
					text: it.text,
					x: it.x,
					y: it.y
				}
			})
	};


}
module.exports = ImageMatrix;
