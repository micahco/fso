import Country from "./Country"

const CountryList = ({ countries, showCountry }) => {
	return (
		<ul>
			{countries.map(c => 
				<li key={c.ccn3}>
					{c.name.common}
					<button onClick={() => showCountry(c.ccn3)}>show</button>
				</li>
			)}
		</ul>
	)
}

const Results = ({ countries, showCountry }) => {
	if (countries) {
		if (countries.length === 1) {
			return (
				<Country country={countries[0]} />
			)
		} else if (countries.length <= 10) {
			return (
				<CountryList
					countries={countries} 
					showCountry={showCountry} />
			)
		} else {
			return (
				<span>Too many matches, specify another filter</span>
			)
		}
	}
}

export default Results