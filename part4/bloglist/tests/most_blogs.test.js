const mostBlogs = require('../utils/list_helper').mostBlogs
const blogs = require('./blogs.fixture')

describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = mostBlogs(blogs.listWithOneBlog)
    expect(result.author).toBe('Edsger W. Dijkstra')
  })

  test('when list has many blogs, calculated correctly', () => {
    const result = mostBlogs(blogs.listWithManyBlogs)
    expect(result.author).toBe('Robert C. Martin')
  })

  test('when list is empty, equals null', () => {
    expect(mostBlogs([])).toEqual(null)
  })
})