const dummy = (blogs) => {
	return blogs ? 1 : 1
}

const totalLikes = (blogs) => {
	const reducer = (total, blog) => {
		return total + blog.likes
	}
	return blogs.reduce(reducer, 0)
}

const getMaxOfProperty = (prop) => {
	return (max, cur) => {
		if (!max || cur[prop] > max[prop]) {
			return cur
		}
		return max
	}
}

const favoriteBlog = (blogs) => {
	return blogs.reduce(getMaxOfProperty('likes'), null)
}

const mostBlogs = (blogs) => {
	const authors = []
	blogs.forEach(blog => {
		const found = authors.find(a => a.author === blog.author)
		found ? found.blogs += 1 : authors.push({
			author: blog.author,
			blogs: 1
		})
	})
	return authors.reduce(getMaxOfProperty('blogs'), null)
}

const mostLikes = (blogs) => {
	const authors = []
	blogs.forEach(blog => {
		const found = authors.find(a => a.author === blog.author)
		found ? found.likes += blog.likes : authors.push({
			author: blog.author,
			likes: blog.likes
		})
	})
	return authors.reduce(getMaxOfProperty('likes'), null)
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}