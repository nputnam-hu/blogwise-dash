import Client from '../../../../client'

export async function loadUser() {
  const client = new Client()
  const blog = await client.get('/blogs')

  return {
    title: blog.title || '',
    description: blog.description || '',
    facebookUrl: blog.facebookUrl || '',
    twitterUrl: blog.twitterUrl || '',
    linkedinUrl: blog.linkedinUrl || '',
    siteUrl: blog.mainSiteUrl || '',
    tags: blog.tags || {},
    logoUri: blog.logoUri || '',
    backgroundHexCode: blog.backgroundHexCode || '',
  }
}

export async function saveUser(state) {
  const client = new Client()
  await client.put('/blogs', state)
}
