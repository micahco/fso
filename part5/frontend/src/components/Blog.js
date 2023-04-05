import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, isOwner, onLike, onRemove }) => {
	const [showDetails, setShowDetails] = useState(false)

	const details = () => (
		<div className='blog-details'>
			<a className='blog-details-url' href={blog.url}>
				{blog.url}
			</a><br/>
			<span className='blog-details-likes'>
				{blog.likes} likes
			</span>
			<button className='blog-details-likebtn' onClick={onLike}>
				like
			</button><br/>
			<small className='blog-details-user'>
				uploader: {blog.user.name}
			</small><br/>
			{isOwner ?
				<button className='blog-details-removebtn' onClick={onRemove}>remove</button>
				: null }
		</div>
	)

	return (
		<div className='blog'>
			<span className='blog-title'>
				{blog.title}
			</span>
			<span className='blog-author'>
				by {blog.author}
			</span>
			<button className='blog-showbtn' onClick={() => setShowDetails(!showDetails)}>
				{showDetails ? 'hide' : 'view'}
			</button>
			{showDetails && details()}
		</div>
	)
}

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	isOwner: PropTypes.bool.isRequired,
	onLike: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired
}

export default Blog