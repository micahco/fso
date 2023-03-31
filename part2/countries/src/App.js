import { useState, useEffect } from 'react'

import Search from './components/Search'
import Results from './components/Results'
import countriesService from './services/countries'

const App = () => {

  const [countries, setCountries] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    countriesService.getAll().then(initialCountries => {
      setCountries(initialCountries)
    })
  }, [])

  useEffect(() => {
    const nameIncludesQuery = (c) => {
      const q = query.toLowerCase()
      return c.name.common.toLowerCase().includes(q)
    }
    if (query === '') {
      setFilteredCountries(null)
    } else if (countries && query) {
      setFilteredCountries(countries.filter(nameIncludesQuery))
    }
  }, [query, countries])

  const showCountry = (ccn3) => {
    setFilteredCountries(filteredCountries.filter(c => c.ccn3 === ccn3))
  }

  return (
    <div className="App">
      <Search query={query} onChange={(e) => setQuery(e.target.value)} />
      <Results countries={filteredCountries} showCountry={showCountry} />
    </div>
  );
}

export default App;
