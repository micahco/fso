const mongoose = require('mongoose')
const supertest = require('supertest')

const User = require('../models/user')
const usersHelper = require('./users_helper')
const app = require('../app')
const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await usersHelper.create('root', 'Super Root', 'password')
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersHelper.getAll()
    const newUser = { username: 'paul', name: 'Paul Allen', password: 'watermark' }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await usersHelper.getAll()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersHelper.getAll()
    const newUser = { username: 'root', name: 'Superuser', password: 'password' }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('expected `username` to be unique')
    const usersAtEnd = await usersHelper.getAll()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

describe('when there is initially many users in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    for (let user of usersHelper.fixture) {
      await usersHelper.create(user.username, user.name, user.password) // or create(...Object.values(user))
    }
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersHelper.getAll()
    const newUser = { username: 'newuser', name: 'New User', password: 'password' }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await usersHelper.getAll()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})