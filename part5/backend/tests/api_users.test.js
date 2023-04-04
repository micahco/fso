const mongoose = require('mongoose')
const supertest = require('supertest')

const usersHelper = require('../utils/users_helper')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
	await usersHelper.empty()
	for (let user of usersHelper.fixture) {
		await usersHelper.create(user.username, user.name, user.password) // or create(...Object.values(user))
	}
})

describe('GET', () => {
	test('users are returned as json', async () => {
		await api
			.get('/api/users')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('all users are returned', async () => {
		const response = await api.get('/api/users')
		expect(response.body).toHaveLength(usersHelper.fixture.length)
	})

	test('a specific user is within the returned users', async () => {
		const response = await api.get('/api/users')
		const userNamesAtEnd = response.body.map(user => user.Name)
		expect(userNamesAtEnd).toContain(usersHelper.fixture[0].Name)
	})

	test('users are defined', async () => {
		const users = await usersHelper.getAll()
		expect(users[0]).toBeDefined()
	})
})

describe('POST', () => {
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

	test('creation fails with a short username', async () => {
		const newUser = { username: 'hi', name: 'Paul Allen', password: 'watermark' }
		await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
		const usersAtEnd = await usersHelper.getAll()
		expect(usersAtEnd).toHaveLength(usersHelper.fixture.length)
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

describe('DELETE', () => {
	test('a user can be deleted', async () => {
		const usersAtStart = await usersHelper.getAll()
		const userToDelete = usersAtStart[0]
		await api
			.delete(`/api/users/${userToDelete.id}`)
			.expect(204)
		const usersAtEnd = await usersHelper.getAll()
		expect(usersAtEnd).toHaveLength(usersHelper.fixture.length - 1)
		const users = usersAtEnd.map(u => u.username)
		expect(users).not.toContain(userToDelete.username)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})