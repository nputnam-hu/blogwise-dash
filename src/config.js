const config = {
  apiUrl: process.env.API_URL || 'https://megaphone-api-prod.herokuapp.com',
  jsonFileName: 'user.json',
}

export const jsonS3Uri = `https://s3.amazonaws.com/megaphone-json-files/${
  config.jsonFileName
}`

export default config
