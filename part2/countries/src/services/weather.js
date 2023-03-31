import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const api_key = process.env.REACT_APP_API_KEY

const get = (city) => {
	const request = axios.get(`${baseUrl}/?q=${city}&appid=${api_key}`)
	return request.then(response => response.data)
}

// eslint-disable-next-line 
export default { get }