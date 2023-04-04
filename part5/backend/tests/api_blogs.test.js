const mongoose = require('mongoose')
const supertest = require('supertest')

const Blog = require('../models/blog')
const blogsHelper = require('../utils/blogs_helper')
const usersHelper = require('../utils/users_helper')
const app = require('../app')
const api = supertest(app)
let token

beforeEach(async () => {
	await usersHelper.empty()
	const user = await usersHelper.create('root', 'Super Root', 'password')

	const response = await api
		.post('/api/login')
		.send({ username: 'root', password: 'password' })
	token = response.body.token

	await Blog.deleteMany({})
	for (let blog of blogsHelper.fixture) {
		let blogObject = new Blog({
			title: blog.title,
			author: blog.author,
			url: blog.url,
			likes: blog.likes,
			user: user.id
		})
		await blogObject.save()
	}

	let anotherUsersBlog = new Blog({
		title: 'Different Blog',
		author: 'Johnny Appleseed',
		url: 'https://different.com',
		user: [...user.id].reverse().join('') // a different id
	})
	await anotherUsersBlog.save()
})

describe('GET', () => {
	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('all blogs are returned', async () => {
		const response = await api.get('/api/blogs')
		expect(response.body).toHaveLength(blogsHelper.fixture.length + 1)
	})

	test('a specific blog is within the returned blogs', async () => {
		const response = await api.get('/api/blogs')
		const blogTitlesAtEnd = response.body.map(blog => blog.title)
		expect(blogTitlesAtEnd).toContain(blogsHelper.fixture[0].title)
	})

	test('blogs are defined', async () => {
		const blogs = await blogsHelper.getAll()
		expect(blogs[0]).toBeDefined()
	})
})

describe('POST', () => {
	test('a valid blog can be added', async () => {
		const blogsAtStart = await blogsHelper.getAll()
		const newBlog = {
			title: 'A Complete Guide to useEffect',
			author: 'Dan Abramov',
			url: 'https://overreacted.io/a-complete-guide-to-useeffect/',
			likes: 8
		}
		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)
		const blogsAtEnd = await blogsHelper.getAll()
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
		const blogTitlesAtEnd = blogsAtEnd.map(blog => blog.title)
		expect(blogTitlesAtEnd).toContain(newBlog.title)
	})

	test('a blog can be added without likes and the likes default to 0', async () => {
		const blogsAtStart = await blogsHelper.getAll()
		const newBlog = {
			title: 'A Complete Guide to useEffect',
			author: 'Dan Abramov',
			url: 'https://overreacted.io/a-complete-guide-to-useeffect/'
		}
		const response = await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)
		expect(response.body.likes).toBe(0)
		const blogsAtEnd = await blogsHelper.getAll()
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
	})

	test('a blog without title is not added', async () => {
		const blogsAtStart = await blogsHelper.getAll()
		const newBlog = {
			author: 'Dan Abramov',
			url: 'https://overreacted.io/a-complete-guide-to-useeffect/',
			likes: 8
		}
		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(400)
		const blogsAtEnd = await blogsHelper.getAll()
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
	})

	test('a blog without url is not added', async () => {
		const blogsAtStart = await blogsHelper.getAll()
		const newBlog = {
			title: 'A Complete Guide to useEffect',
			author: 'Dan Abramov',
			likes: 8
		}
		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(400)
		const blogsAtEnd = await blogsHelper.getAll()
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
	})

	test('a blog with out an authorization header is not added', async () => {
		const blogsAtStart = await blogsHelper.getAll()
		const newBlog = {
			title: 'A Complete Guide to useEffect',
			author: 'Dan Abramov',
			likes: 8
		}
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400)
		const blogsAtEnd = await blogsHelper.getAll()
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
	})
})

describe('DELETE', () => {
	test('a blog can be deleted', async () => {
		const blogsAtStart = await blogsHelper.getAll()
		const blogToDelete = blogsAtStart[0]
		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204)
		const blogsAtEnd = await blogsHelper.getAll()
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
		const titles = blogsAtEnd.map(b => b.title)
		expect(titles).not.toContain(blogToDelete.title)
	})

	test('a blog can not be deleted without an auth token', async () => {
		const blogsAtStart = await blogsHelper.getAll()
		const blogToDelete = blogsAtStart[0]
		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(400)
		const blogsAtEnd = await blogsHelper.getAll()
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
	})

	test('a blog can not be deleted with an invalid auth token', async () => {
		const blogsAtStart = await blogsHelper.getAll()
		const anotherUsersBlog = blogsAtStart[blogsAtStart.length - 1]
		await api
			.delete(`/api/blogs/${anotherUsersBlog.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(401)
		const blogsAtEnd = await blogsHelper.getAll()
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})