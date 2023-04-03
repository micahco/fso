const mongoose = require('mongoose')
const supertest = require('supertest')

const Blog = require('../models/blog')
const blogsHelper = require('./blogs_helper')
const usersHelper = require('./users_helper')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  await usersHelper.create('root', 'Super Root', 'password')
  const user = await usersHelper.getOne()
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
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(blogsHelper.fixture.length)
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

test('a valid blog can be added', async () => {
  const user = await usersHelper.getOne()
  const newBlog = {
    title: 'A Complete Guide to useEffect',
    author: 'Dan Abramov',
    url: 'https://overreacted.io/a-complete-guide-to-useeffect/',
    likes: 8,
    userId: user.id
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const blogsAtEnd = await blogsHelper.getAll()
  expect(blogsAtEnd).toHaveLength(blogsHelper.fixture.length + 1)
  const blogTitlesAtEnd = blogsAtEnd.map(blog => blog.title)
  expect(blogTitlesAtEnd).toContain(newBlog.title)
})

test('a blog can be added without likes and the likes default to 0', async () => {
  const user = await usersHelper.getOne()
  const newBlog = {
    title: 'A Complete Guide to useEffect',
    author: 'Dan Abramov',
    url: 'https://overreacted.io/a-complete-guide-to-useeffect/',
    userId: user.id
  }
  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  expect(response.body.likes).toBe(0)
  const blogsAtEnd = await blogsHelper.getAll()
  expect(blogsAtEnd).toHaveLength(blogsHelper.fixture.length + 1)
})

test('a blog without title is not added', async () => {
  const user = await usersHelper.getOne()
  const newBlog = {
    author: 'Dan Abramov',
    url: 'https://overreacted.io/a-complete-guide-to-useeffect/',
    likes: 8,
    userId: user.id
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  const blogsAtEnd = await blogsHelper.getAll()
  expect(blogsAtEnd).toHaveLength(blogsHelper.fixture.length)
})

test('a blog without url is not added', async () => {
  const user = await usersHelper.getOne()
  const newBlog = {
    title: 'A Complete Guide to useEffect',
    author: 'Dan Abramov',
    likes: 8,
    userId: user.id
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  const blogsAtEnd = await blogsHelper.getAll()
  expect(blogsAtEnd).toHaveLength(blogsHelper.fixture.length)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await blogsHelper.getAll()
  const blogToDelete = blogsAtStart[0]
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  const blogsAtEnd = await blogsHelper.getAll()
  expect(blogsAtEnd).toHaveLength(blogsHelper.fixture.length - 1)
  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).not.toContain(blogToDelete.title)
})

test('a blog\'s number of likes can be updated', async () => {
  const blogsAtStart = await blogsHelper.getAll()
  const updatedBlog = blogsAtStart[0]
  updatedBlog.likes += 1
  const response = await api
    .put(`/api/blogs/${updatedBlog.id}`)
    .send(updatedBlog)
    .expect(200)
  expect(response.body.likes).toBe(updatedBlog.likes)
})

afterAll(async () => {
  await mongoose.connection.close()
})