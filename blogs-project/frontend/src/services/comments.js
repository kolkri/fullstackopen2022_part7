import axios from 'axios'

const getAll = (id) => {
  const request = axios.get(`http://localhost:3001/api/blogs/${id}/comments`)
  return request.then((response) => response.data)
}

const create = async (id, newObject) => {
  const response = await axios.post(`http://localhost:3001/api/blogs/${id}/comments`, newObject)
  return response.data
}


export default { getAll, create }
