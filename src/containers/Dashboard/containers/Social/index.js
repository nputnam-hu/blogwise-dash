import React, { Component } from 'react'
import { Button } from '@blueprintjs/core'
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

  getPageToken = () => {
    this.client.post('/api/facebook/pagetoken').then(data => console.log(data))
  }

  handleTwitter = () => {
    this.client
      .post('/api/twitter/reverse')
      .then(data => {
        const url = `https://api.twitter.com/oauth/authorize?oauth_token=${
          data.oauth_token
        }`
        window.location = url
      })
      .catch(error => console.log(error))
  }

  responseFacebook = response => {
    console.log(response)
    this.client
      .post('/api/facebook/storetoken', response)
      .then(info => console.log(info))
  }

  componentDidMount() {
    if (window.location.search !== '') {
      const parsed = queryString.parse(window.location.search)
      if ('oauth_token' in parsed) {
        this.client.post('/api/twitter', parsed).then(org => console.log(org))
      } else if ('code' in parsed) {
        this.client
          .post('/api/linkedin/storetoken', parsed)
          .then(user => console.log(user))
      }
    }
    this.client.get('/organizations').then(orgs => {
      this.setState(prev => ({ loading: !prev.loading }))
      if (orgs.twitterToken) {
        this.client.get('/api/twitter/identify').then(user => {
          this.setState({ twitterId: user.screen_name })
        })
      }
      if (orgs.facebookToken) {
        this.client.get('/api/facebook/identify').then(user => {
          console.log(user)
          this.setState({ facebookId: user.name })
        })
      }
      if (orgs.linkedinToken) {
        this.client.get('/api/linkedin/identify').then(user => {
          this.setState({
            linkedinId: `${user.localizedFirstName} ${user.localizedLastName}`,
          })
        })
      }
    })
  }

  render() {
    const { twitterId, facebookId, linkedinId, loading } = this.state
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
            <div id="twitter-row">
              <BlueButton
                icon="upload"
                onClick={this.handleTwitter}
                style={{ width: '200px', height: '60px' }}
              >
                Connect to Twitter
              </BlueButton>
              {twitterId !== '' && (
                <p>
                  <strong>Logged in as: </strong>
                  {twitterId}
                </p>
              )}
            </div>
            <div id="facebook-row">
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
              {facebookId !== '' && (
                <p>
                  <strong>Logged in as: </strong>
                  {facebookId}
                </p>
              )}
            </div>
            <div id="linkedin-row">
              <BlueButton
                icon="upload"
                onClick={() => window.location.replace(linkedinUrl)}
                style={{ width: '200px', height: '60px' }}
              >
                Connect to Linkedin
              </BlueButton>
              {linkedinId !== '' && (
                <p>
                  <strong>Logged in as: </strong>
                  {linkedinId}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Social
