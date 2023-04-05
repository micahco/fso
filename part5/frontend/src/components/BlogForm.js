import { useState } from 'react'

const Input = ({ label, value, handleChange }) => {
	return (
		<div>
			<label htmlFor={label}>{label} </label>
			<input
				className={`blogform-${label}`}
				type="text"
				value={value}
				name={label}
				onChange={handleChange}
			/>
		</div>
	)
}

const BlogForm = ({ onSubmit }) => {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')

	const clear = () => {
		setTitle('')
		setAuthor('')
		setUrl('')
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		onSubmit({ title, author, url })
		clear()
	}

	return (
		<form className='blogform' onSubmit={handleSubmit}>
			<Input
				label='title'
				value={title}
				handleChange={e => setTitle(e.target.value)} />
			<Input
				label='author'
				value={author}
				handleChange={e => setAuthor(e.target.value)} />
			<Input
				label='url'
				value={url}
				handleChange={e => setUrl(e.target.value)} />
			<button className='blogform-submit' type="submit">create</button>
		</form>
	)
}

export default BlogForm