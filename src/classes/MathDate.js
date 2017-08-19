class MathDate{

	/**
	 * @return {Date}
	 */
	getCurrentDate(){
		const d = new Date();
		const ss = parseInt(d.getSeconds()/10)*10;
		return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), ss, 0)
	}
}

module.exports = MathDate;
