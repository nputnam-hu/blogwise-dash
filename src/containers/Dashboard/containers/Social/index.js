import React, { Component } from 'react'
import { Button } from '@blueprintjs/core'
import TwitterLogin from 'react-twitter-auth'
import queryString from 'query-string'
import FacebookButton from './components/Facebook'
import config from '../../../../config'
import Client from '../../../../client'
import './styles.sass'
import BlueButton from '../../../../components/BlueButton'

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
      twitterId: '',
      facebookId: '',
      linkedinId: '',
      loading: true,
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

  getPageToken = () => {
    this.client.post('/api/facebook/pagetoken').then(data => console.log(data))
  }

  responseFacebook = response => {
    console.log(response)
    this.client
      .post('/api/facebook/storetoken', response._token)
      .then(user => console.log(user))
  }

  componentDidMount() {
    if (window.location.search !== '') {
      const parsed = queryString.parse(window.location.search)
      this.client
        .post('/api/linkedin/storetoken', parsed)
        .then(user => console.log(user))
    }
    this.client
      .get('/organizations')
      .then(orgs => this.setState(prev => ({ loading: !prev.loading })))
  }

  render() {
    const { loading } = this.state
    return (
      <div id="social">
        <Button
          small
          icon="arrow-left"
          minimal
          onClick={() => this.props.history.push('/dashboard/postgenius')}
        >
          Back to Post Genius
        </Button>
        <h1>Social Accounts</h1>
        {!loading && (
          <div id="buttons-container">
            <TwitterLogin
              style={{ padding: '0px', border: '0px' }}
              loginUrl="http://localhost:3001/api/twitter"
              text="Connect twitter account"
              onFailure={this.onFailed}
              onSuccess={this.onSuccess}
              requestTokenUrl="http://localhost:3001/api/twitter/reverse"
              showIcon
            >
              <BlueButton
                icon="upload"
                style={{ width: '200px', height: '60px' }}
              >
                Connect to Twitter
              </BlueButton>
            </TwitterLogin>
            <FacebookButton
              provider="facebook"
              appId="1078110902387157"
              scope="public_profile,publish_pages,manage_pages"
              onLoginSuccess={this.responseFacebook}
              onLoginFailure={this.onFailed}
              style={{ width: '200px', height: '60px' }}
            >
              Connect to Facebook
            </FacebookButton>
            <BlueButton
              icon="upload"
              onClick={() => window.location.replace(linkedinUrl)}
              style={{ width: '200px', height: '60px' }}
            >
              Connect to Linkedin
            </BlueButton>
            <BlueButton
              icon="upload"
              onClick={this.getPageToken}
              style={{ width: '200px', height: '60px' }}
            >
              Get Facebook Page Access
            </BlueButton>
          </div>
        )}
      </div>
    )
  }
}

export default Social
