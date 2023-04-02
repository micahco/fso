const mostLikes = require('../utils/list_helper').mostLikes
const blogs = require('./blogs.fixture')

describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = mostLikes(blogs.listWithOneBlog)
    expect(result.author).toBe('Edsger W. Dijkstra')
  })

  test('when list has many blogs, calculated correctly', () => {
    const result = mostLikes(blogs.listWithManyBlogs)
    expect(result.author).toBe('Edsger W. Dijkstra')
  })

  test('when list is empty, equals null', () => {
    expect(mostLikes([])).toEqual(null)
  })
})