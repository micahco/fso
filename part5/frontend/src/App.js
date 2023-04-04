import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import CreateBlogForm from './components/CreateBlogForm'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({title: 'New Title', author: 'New Author', url: 'https://new-url.com'})
  const [notifyMessage, setNotifyMessage] = useState(null)
  const [hasError, setHasError] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, isError) => {
    console.log(message, isError)
    setNotifyMessage(message)
    setHasError(isError)
    setTimeout(() => {
      setNotifyMessage(null)
      setHasError(false)
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notify('wrong username or password', true)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBloglistUser')
    blogService.setToken('')
  }
  
  const handleCreateBlog = async (event) => {
    event.preventDefault()
    const resBlog = await blogService.create(newBlog)
    setBlogs(blogs.concat(resBlog))
    notify(`a new blog ${resBlog.title} by ${resBlog.author} added`)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notifyMessage} isError={hasError} />
        <LoginForm
          onSubmit={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword} />
      </div>
    )
  } else {
    return (
      <div>
        <h2>blogs</h2>
        <Notification message={notifyMessage} isError={hasError} />
        <CreateBlogForm
          onSubmit={handleCreateBlog} 
          newBlog={newBlog}
          setNewBlog={setNewBlog} />
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
        </div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }
}

export default App