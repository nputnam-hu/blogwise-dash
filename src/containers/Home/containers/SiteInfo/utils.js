import axios from 'axios'
import config, { jsonS3Uri } from '../../../../config'

export async function loadUser() {
  const { data: user } = await axios.get(jsonS3Uri)

  return {
    title: user.title || '',
    description: user.description || '',
    facebookUrl: user.social.facebook || '',
    twitterUrl: user.social.twitter || '',
    linkedinUrl: user.social.linkedin || '',
    siteUrl: user.social.mainSite || '',
    tags: user.tags || {},
    logoUri: user.logoUri || '',
  }
}

export async function saveUser(state) {
  const { data: user } = await axios.get(jsonS3Uri)
  user.title = state.title || user.title
  user.description = state.description || user.description
  user.social.facebook = state.facebookUrl || user.social.facebook
  user.social.twitter = state.twitterUrl || user.social.twitter
  user.social.linkedin = state.linkedinUrl || user.social.linkedin
  user.social.mainSite = state.siteUrl || user.social.mainSite
  user.tags = { ...state.tags } || user.tags
  user.logoUri = state.logoUri || user.logoUri

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
