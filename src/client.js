import rp from 'request-promise'
import store from 'store'
import config from './config'

class Client {
  constructor() {
    const user = store.get('user')
    this.token = user ? user.token : null
    this.defaultOptions = {
      headers: {
        'x-access-token': this.token,
      },
      json: true,
    }
  }
  get(stub, options = {}) {
    return rp({
      uri: config.apiUrl + stub,
      method: 'GET',
      ...this.defaultOptions,
      ...options,
    })
  }
  post(stub, body = {}, options = {}) {
    return rp({
      uri: config.apiUrl + stub,
      method: 'POST',
      body,
      ...this.defaultOptions,
      ...options,
    })
  }
  put(stub, body = {}, options = {}) {
    return rp({
      uri: config.apiUrl + stub,
      method: 'PUT',
      body,
      ...this.defaultOptions,
      ...options,
    })
  }
  delete(stub, body = {}, options = {}) {
    return rp({
      uri: config.apiUrl + stub,
      method: 'DELETE',
      body,
      ...this.defaultOptions,
      ...options,
    })
  }
}

export function uploadFileToS3(file, client) {
  return client
    .put('/s3/logo', {
      fileName: `${Date.now()}_${file.name}`,
      contentType: file.type,
    })
    .then(url =>
      rp({
        uri: url,
        file,
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
      }).then(() => url),
    )
}

export default Client
