import { useState, useEffect } from 'react'

import weatherService from '../services/weather'

const LanguageList = ({ languages }) => {
	return (
		<ul>
			{languages.map((l, i) =>
				<li key={i}>{l}</li>
			)}
		</ul>
	)
}

const Weather = ({ data, capital }) => {
	
	const kelvinToCelsius = (kelvin) => {
		return Math.round((kelvin - 274.15) * 10) / 10
	}
	
	if (data) {
		const condition = data.weather[0]
		return (
			<div>
				<h2>Weather in {capital}</h2>
				<p>temperature {kelvinToCelsius(data.main.temp)} Celsius</p>
				<img
					alt={condition.description}
					src={`https://openweathermap.org/img/wn/${condition.icon}@4x.png`} />
				<p>wind {data.wind.speed} m/s</p>
			</div>
		)
	}
}

const Country = ({ country }) => {
	
	const [weather, setWeather] = useState(null)
	
	useEffect(() => {
		weatherService.get(country.capital[0])
			.then(response => setWeather(response))
	}, [country.capital]) // included to get rid of eslint warning... I don't know what solution is best yet.

	return (
		<div>
			<h2>{country.name.common}</h2>
			<p>capital {country.capital[0]}</p>
			<p>area {country.area}</p>
			<h3>languages:</h3>
			<LanguageList languages={Object.values(country.languages)} />
			<img alt={country.name.common} src={country.flags.png} width={200} />
			<Weather data={weather} capital={country.capital[0]} />
		</div>
	)
}

export default Country