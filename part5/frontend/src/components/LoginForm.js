const loginForm = (props) => (
	<form onSubmit={props.onSubmit}>
		<div>
			<label htmlFor="username">username </label>
			<input
				type="text"
				value={props.username}
				name="username"
				onChange={({ target }) => props.setUsername(target.value)}
			/>
		</div>
		<div>
			<label htmlFor="password">password </label>
			<input
				type="password"
				value={props.password}
				name="password"
				onChange={({ target }) => props.setPassword(target.value)}
			/>
		</div>
		<button type="submit">login</button>
	</form>      
)

export default loginForm