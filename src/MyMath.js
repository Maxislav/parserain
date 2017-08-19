/*
const _MyMath = {
	radians: function (degrees) {
		return degrees * Math.PI / 180;
	},
	degrees: function (radians) {
		return radians * 180 / Math.PI;
	},
	getRandom: function (min, max, int) {
		let rand = min + Math.random() * (max - min);
		if (int) {
			rand = Math.round(rand)
		}
		return rand;
	},
	normalizeDegree: (alpha) => {
		const floor = Math.ceil(alpha / 360);
		if (360 < alpha) {
			alpha = alpha - floor * 360
		}
		if (alpha < 0) {
			alpha = 360 + alpha
		}
		return alpha
	},
	toFixed: (value, n) => {
		return (Math.round(value * Math.pow(10, n || 0)) / Math.pow(10, n || 0)).toFixed(n || 0)
	}
};*/

/**
 *
 * @typedef {Math} MyMath
 * @type {*}
 * @augments Math
 * @extends Math
 * @param {function} round
 */
const MyMath = {};
/**
 * @static
 * @param {number} degrees
 * @return {number}
 */
MyMath.radians = function (degrees) {
	return degrees * Math.PI / 180;
};
MyMath.degrees = function (radians) {
	return radians * 180 / Math.PI;
};
MyMath.getRandom = function (min, max, int) {
	let rand = min + Math.random() * (max - min);
	if (int) {
		rand = Math.round(rand)
	}
	return rand;
};
MyMath.normalizeDegree = (alpha) => {
	const floor = Math.ceil(alpha / 360);
	if (360 < alpha) {
		alpha = alpha - floor * 360
	}
	if (alpha < 0) {
		alpha = 360 + alpha
	}
	return alpha
};
MyMath.toFixed = (value, n) => {
	return (Math.round(value * Math.pow(10, n || 0)) / Math.pow(10, n || 0)).toFixed(n || 0)
}


module.exports = Object.assign(Object.create(Math), MyMath );
