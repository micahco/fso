const totalLikes = require('../utils/list_helper').totalLikes
const { listWithOneBlog, listWithManyBlogs } = require('./blogs.fixture')

describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has many blogs, calculated correctly', () => {
    const result = totalLikes(listWithManyBlogs)
    expect(result).toBe(36)
  })

  test('when list is empty, equals 0', () => {
    expect(totalLikes([])).toBe(0)
  })
})