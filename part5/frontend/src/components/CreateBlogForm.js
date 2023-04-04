const Input = ({ label, newBlog, handleChange }) => {
	return (		
		<div>
			<label htmlFor={label}>{label} </label>
			<input
				type="text"
				value={newBlog[label]}
				name={label}
				onChange={handleChange}
			/>
		</div>
	)
}

const CreateBlogForm = ({ onSubmit, newBlog, setNewBlog }) => {
	const handleChange = ({ target }) => {
		const blogObject = { ...newBlog }
		blogObject[target.name] = target.value
		setNewBlog(blogObject)
	}

	return (
		<form onSubmit={onSubmit}>
			<Input
				label='title'
				newBlog={newBlog}
				handleChange={handleChange} />
			<Input
				label='author'
				newBlog={newBlog}
				handleChange={handleChange} />
			<Input
				label='url'
				newBlog={newBlog}
				handleChange={handleChange} />
			<button type="submit">create</button>
		</form>
	)
}

export default CreateBlogForm