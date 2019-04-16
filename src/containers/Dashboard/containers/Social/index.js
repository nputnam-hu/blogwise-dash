import React, { Component } from 'react'
import { Button } from '@blueprintjs/core'
import TwitterLogin from 'react-twitter-auth'
import FacebookLogin from 'react-facebook-login'
import queryString from 'query-string'
import config from '../../../../config'
import Client from '../../../../client'
import './styles.sass'

const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${
  config.linkedin.client_id
}&redirect_uri=${
  config.linkedin.redirect_uri
}&state=noahisabasedgod&scope=r_liteprofile%20r_emailaddress%20w_member_social
`

class Social extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      twitterToken: '',
      code: '',
    }
  }

  onSuccess = response => {
    response.json().then(userInfo => {
      if (userInfo) {
        this.client
          .post('/api/twitter/storetoken', userInfo)
          .then(data => console.log(data))
      }
    })
  }

  onFailed = error => {
    alert(error)
  }

  responseFacebook = response => {
    this.client
      .post('/api/facebook/storetoken', response)
      .then(user => console.log(user))
  }

  componentDidMount() {
    if (window.location.search !== '') {
      const parsed = queryString.parse(window.location.search)
      this.client
        .post('/api/linkedin/storetoken', parsed)
        .then(user => console.log(user))
    }
  }

  render() {
    return (
      <div className="social">
        <Button
          small
          icon="arrow-left"
          minimal
          onClick={() => this.props.history.push('/dashboard/postgenius')}
        >
          Back to Post Genius
        </Button>
        <h1>Social Accounts</h1>
        <TwitterLogin
          style={{ borderRadius: '10px', padding: '10px' }}
          loginUrl="http://localhost:3001/api/twitter"
          text="Connect twitter account"
          onFailure={this.onFailed}
          onSuccess={this.onSuccess}
          requestTokenUrl="http://localhost:3001/api/twitter/reverse"
          showIcon
          // customHeaders={customHeader}
        />
        <FacebookLogin
          appId="1078110902387157"
          fields="name,email,picture"
          scope="public_profile,manage_pages,publish_pages"
          callback={this.responseFacebook}
        />
        <a href={linkedinUrl}>Login Linked</a>
      </div>
    )
  }
}

export default Social
