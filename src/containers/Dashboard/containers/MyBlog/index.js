import React, { Component } from 'react'
import Client from '../../../../client'

class MyBlog extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      siteUrl: '',
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.setState({ siteUrl: blog.siteUrl })
    })
  }
  render() {
    const { siteUrl } = this.state
    return (
      <div>
        <h2>Your Site</h2>
        <span>
          Url:{' '}
          <a target="_blank" rel="noopener noreferrer" href={siteUrl}>
            {siteUrl}
          </a>
        </span>
        <h2>Edit Content</h2>
        <span>
          {' '}
          Url:{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${siteUrl}/admin`}
          >
            {`${siteUrl}/admin`}
          </a>
        </span>
      </div>
    )
  }
}

export default MyBlog
