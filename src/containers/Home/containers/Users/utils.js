import axios from 'axios'
import config, { jsonS3Uri } from '../../../../config'

export async function loadUser() {
  const { data: user } = await axios.get(jsonS3Uri)
  return {
    authors: user.authors || {},
  }
}

export async function saveUser(state) {
  const { data: user } = await axios.get(jsonS3Uri)
  user.authors = { ...state.authors } || user.authors

  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const { data: url } = await axios.put(`${config.apiUrl}/s3/json`, {
    fileName: config.jsonFileName,
    contentType: 'application/json',
  })

  await axios.put(url, user, options)
}
