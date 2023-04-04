const Blog = require('../models/blog')
const fixture = require('./blogs_fixture').listWithManyBlogs

const getAll = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

module.exports = { fixture, getAll }