const Person = ({ person, onDelete }) => {
	return (
		<tr>
			<td>{person.name}</td>
			<td>{person.number}</td>
			<td><button onClick={onDelete}>delete</button></td>
		</tr>
	)
}

const Persons = ({ personsToShow, deletePerson }) => {
	const handleOnDelete = (person) => {
		if (window.confirm(`Delete ${person.name}?`)) {
			deletePerson(person.id)
		}
	}
	return (
		<table><tbody>
		{personsToShow.map(person =>
			<Person
				key={person.name}
				person={person} 
				onDelete={() => handleOnDelete(person)} />
		)}
		</tbody></table>
	)
}

export default Persons