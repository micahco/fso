import { useState, useEffect, useRef } from 'react'

import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [notifyMessage, setNotifyMessage] = useState(null)
	const [hasError, setHasError] = useState(false)
	const [user, setUser] = useState(null)
	const blogFormRef = useRef()

	useEffect(() => {
		blogService.getAll().then(blogs =>
			setBlogs(blogs)
		)
	}, [])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
		// check auth ???
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			blogService.setToken(user.token)
		}
	}, [])

	const notify = (message, isError) => {
		setNotifyMessage(message)
		setHasError(isError)
		setTimeout(() => {
			setNotifyMessage(null)
			setHasError(false)
		}, 3000)
	}

	const handleLogin = async (credentials) => {
		try {
			const user = await loginService.login(credentials)
			window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
			blogService.setToken(user.token)
			setUser(user)
		} catch (exception) {
			notify('wrong username or password', true)
		}
	}

	const handleLogout = () => {
		setUser(null)
		window.localStorage.removeItem('loggedBloglistUser')
		blogService.setToken('')
	}

	const addBlog = async (blog) => {
		blogFormRef.current.toggleVisibility()
		const resBlog = await blogService.create(blog)
		resBlog.user = user
		setBlogs(blogs.concat(resBlog))
		notify(`a new blog ${resBlog.title} by ${resBlog.author} added`)
	}

	const likeBlog = async (blog) => {
		await blogService.like(blog)
		const resBlog = await blogService.getOne(blog.id)
		setBlogs(blogs.filter(b => b.id !== blog.id).concat(resBlog)) // out with the old, in with the new
	}

	const removeBlog = async (blog) => {
		await blogService.remove(blog.id)
		setBlogs(blogs.filter(b => b.id !== blog.id))
	}

	if (user === null) {
		return (
			<div>
				<h2>Log in to application</h2>
				<Notification message={notifyMessage} isError={hasError} />
				<LoginForm onSubmit={handleLogin} />
			</div>
		)
	} else {
		return (
			<div>
				<h2>blogs</h2>
				<Notification message={notifyMessage} isError={hasError} />
				<Togglable buttonLabel='new blog' ref={blogFormRef}>
					<BlogForm onSubmit={addBlog} />
				</Togglable>
				<div>
					<p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
				</div>
				<div id='bloglist'>
					{blogs.sort((a, b) => a.likes < b.likes ? 1 : -1).map(blog =>
						<Blog
							key={blog.id}
							isOwner={blog.user.username === user.username}
							blog={blog}
							onLike={() => likeBlog(blog)}
							onRemove={() => window.confirm(`Remove blog ${blog.title} by ${blog.author}`) && removeBlog(blog)} />
					)}
				</div>
			</div>
		)
	}
}

export default App