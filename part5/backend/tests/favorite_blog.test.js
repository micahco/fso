const favoriteBlog = require('../utils/list_helper').favoriteBlog
const blogs = require('../utils/blogs_fixture')

describe('total likes', () => {
	test('when list has only one blog, equals the likes of that', () => {
		const result = favoriteBlog(blogs.listWithOneBlog)
		expect(result.likes).toBe(5)
	})

	test('when list has many blogs, calculated correctly', () => {
		const result = favoriteBlog(blogs.listWithManyBlogs)
		expect(result.likes).toBe(12)
	})

	test('when list is empty, equals null', () => {
		expect(favoriteBlog([])).toEqual(null)
	})
})