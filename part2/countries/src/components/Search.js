
const Search = ({ query, onChange }) => {
	return (
		<div>
			<span>find countries	</span>
			<input value={query} onChange={onChange} />
		</div>
	)
}

export default Search