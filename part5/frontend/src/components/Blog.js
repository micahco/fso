import { useState } from 'react'

const Blog = ({ blog, isOwner, onLike, onRemove }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const details = () => (
    <div>
      <a href={blog.url}>{blog.url}</a><br/>
      {blog.likes} likes
      <button onClick={onLike}>like</button><br/>
      <small>uploader: {blog.user.name}</small><br/>
      {isOwner ? <button onClick={onRemove}>remove</button> : null }
    </div>
  )

  return (
    <div style={blogStyle}>
      <b>{blog.title}</b> by {blog.author}
      <button onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'hide' : 'view'}</button>
      {showDetails && details()}
    </div>
  )
}

export default Blog