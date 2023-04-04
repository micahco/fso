const morgan = require('morgan')
const jwt = require('jsonwebtoken')

const logger = require('./logger')
const User = require('../models/user')

morgan.token('post-body', (req) => {
	if (req.method === 'POST' || req.method === 'PUT') {
		return JSON.stringify(req.body)
	}
})
const requestLogger =	morgan((tokens, req, res) => {
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'), '-',
		tokens['response-time'](req, res), 'ms',
		tokens['post-body'](req, res)
	].join(' ')
})

const tokenExtractor = (request, response, next) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.startsWith('Bearer ')) {
		request.token = authorization.replace('Bearer ', '')
	}
	next()
}

const userExtractor = async (request, response, next) => {
	const decodedToken = jwt.verify(request.token, process.env.SECRET)
	if (decodedToken.id) {
		request.user = await User.findById(decodedToken.id)
	}
	next()
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	logger.error(error.message)
	switch (error.name) {
	case 'CastError':
		return response.status(400).send({ error: 'malformatted id' })
	case 'ValidationError':
		return response.status(400).json({ error: error.message })
	case 'JsonWebTokenError':
		return response.status(400).json({ error: error.message })
	}
	next(error)
}

module.exports = {
	requestLogger,
	tokenExtractor,
	userExtractor,
	unknownEndpoint,
	errorHandler
}