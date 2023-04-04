import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getOne = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const create = async (data) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, data, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  }

  await axios.delete(`${baseUrl}/${id}`, config)
}

const like = async blog => {
  const { id, ...data } = blog
  data.user = data.user.id
  data.likes += 1
  
  const response = await axios.put(`${baseUrl}/${id}`, data)
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { setToken, getAll, getOne, create, remove, like }