const testing = process.env.NODE_ENV === 'test'

const info = (...params) => {
	if (!testing) {
		console.log(...params)
	}
}

const error = (...params) => {
	if (!testing) {
		console.error(...params)
	}
}

module.exports = {
	info, error
}