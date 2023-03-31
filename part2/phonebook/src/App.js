import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notifyMessage, setNotifyMessage] = useState(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const notify = (message, isError) => {
    setNotifyMessage(message)
    setHasError(isError)
    setTimeout(() => {
      setNotifyMessage(null)
      setHasError(false)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }
    const samePerson = persons.find(person => person.name === newName)    
    if (samePerson !== undefined && 
        window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)) {
      updatePerson({...newPerson, id: samePerson.id})
    } else {
      personService.create(newPerson).then(resPerson => {
        setPersons(persons.concat(resPerson))
        clearForm()
        notify(`Added ${resPerson.name}`)
      })
    }
  }

  const updatePerson = (person) => {
    personService.update(person.id, person)
      .then(resPerson => {
        setPersons(persons.map(p => p.id !== person.id ? p : person))
        clearForm()
        notify(`Updated ${resPerson.name}'s number to: ${resPerson.number}`)
      })
      .catch(response => {
        setPersons(persons.filter(p => p.id !== person.id))
        notify(`Information of ${person.name} has already been removed from the server`, true)
      })
  }

  const deletePerson = (id) => {
    personService.remove(id).then(response => {
      if (response.status === 200) {
        setPersons(persons.filter(p => p.id !== id))
      } else {
        console.error('Something went wrong...')
      }
    })
  }

  const clearForm = () => {
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    const newFilter = event.target.value
    setFilter(newFilter)
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notifyMessage} isError={hasError} />
      <Filter value={filter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons
        personsToShow={personsToShow}
        deletePerson={deletePerson} />
    </div>
  )
}

export default App