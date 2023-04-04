const bcrypt = require('bcrypt')

const User = require('../models/user')
const fixture = require('./users_fixture').listWithManyUsers

const getAll = async () => {
	const users = await User.find({})
	return users.map(u => u.toJSON())
}

const getOne = async () => {
	const usersAtStart = await getAll()
	return usersAtStart[0]
}

const empty = async () => {
	await User.deleteMany({})
}

const create = async (username, name, password) => {
	const passwordHash = await bcrypt.hash(password, 10)
	const user = new User({ username, name, passwordHash })
	await user.save()
	return user
}

module.exports = { getAll, getOne, empty, create, fixture }