import { useState } from 'react'

const LoginForm = ({ onSubmit }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const handleSubmit = (event) => {
		event.preventDefault()
		onSubmit({ username, password })
	}

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="username">username </label>
				<input
					type="text"
					value={username}
					name="username"
					onChange={({ target }) => setUsername(target.value)}
				/>
			</div>
			<div>
				<label htmlFor="password">password </label>
				<input
					type="password"
					value={password}
					name="password"
					onChange={({ target }) => setPassword(target.value)}
				/>
			</div>
			<button type="submit">login</button>
		</form>
	)
}

export default LoginForm