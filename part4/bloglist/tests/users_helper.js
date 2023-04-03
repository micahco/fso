const bcrypt = require('bcrypt')

const User = require('../models/user')
const fixture = require('./users.fixture').listWithManyUsers

const getAll = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const getOne = async () => {
  const usersAtStart = await getAll()
  return usersAtStart[0]
}

const create = async (username, name, password) => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash(password, 10)
  const userObject = new User({ username, name, passwordHash })
  await userObject.save()
}

module.exports = {
  getAll, getOne, create, fixture
}