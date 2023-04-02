const Blog = require('../models/blog')
const initialBlogs = require('./blogs.fixture').listWithManyBlogs

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}