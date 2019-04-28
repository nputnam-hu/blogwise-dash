import React, { Component } from 'react'
import { Tabs, Tab, Dialog, Switch } from '@blueprintjs/core'
import Posts from './sections/Posts'
import Client from '../../../../client'
import './styles.sass'
import BlueButton from '../../../../components/BlueButton'

class SocialPoster extends Component {
  constructor(props) {
    super(props)
    this.client = new Client()
    this.state = {
      tabId: 'first',
      isOpen: false,
      isOpen2: false,
      facebook: false,
      twitter: false,
      linkedin: false,
      fbsigned: false,
      twsigned: false,
      lnsigned: false,
      link:
        'https://blog.blogwise.co/a/2019-03-26-part_ii_the_content_marketing_trend_how_blogging_will_help_your_business',
      text: 'Blogwise is producing original content on their own blog',
    }
  }
  handleTabChange = tabId => {
    this.setState({ tabId })
  }
  handleDialogClose = () => {
    this.setState({
      isOpen: false,
      facebook: false,
      twitter: false,
      linkedin: false,
    })
  }
  handleDialogClose2 = () => {
    this.setState({ isOpen2: false })
  }
  componentDidMount() {
    this.client.get('/organizations').then(orgs => {
      if (orgs.facebookToken) {
        this.setState({ fbsigned: true })
      }
      if (orgs.twitterToken) {
        this.setState({ twsigned: true })
      }
      if (orgs.linkedinToken) {
        this.setState({ lnsigned: true })
      }
    })
  }
  handleShare = () => {
    this.client.post('/api/shareall', this.state).then(result => {
      console.log(result)
      this.setState({
        isOpen: false,
        isOpen2: true,
        facebook: false,
        twitter: false,
        linkedin: false,
      })
    })
  }
  render() {
    const {
      isOpen,
      isOpen2,
      facebook,
      twitter,
      linkedin,
      fbsigned,
      twsigned,
      lnsigned,
    } = this.state
    return (
      <div id="socialposter-container">
        <Tabs
          id="socialposter-tabs"
          onChange={this.handleTabChange}
          selectedTabId={this.state.tabId}
          vertical
          large
          animate={false}
        >
          <Tab id="first" title="Your Posts" panel={<Posts />} />
        </Tabs>
        <BlueButton icon="gear" onClick={() => this.setState({ isOpen: true })}>
          Open Dialog
        </BlueButton>
        <Dialog
          className="bp3-dialog-container"
          icon="upload"
          onClose={this.handleDialogClose}
          title="Post to the following outlets"
          isOpen={isOpen}
        >
          <div id="preview-container">
            {fbsigned && (
              <div className="social-preview">
                <p>
                  <strong>Facebook</strong>
                </p>
                <div id="facebook-preview">PREVIEW HERE</div>
                <Switch
                  checked={facebook}
                  onChange={() =>
                    this.setState(prev => ({ facebook: !prev.facebook }))
                  }
                />
              </div>
            )}
            {twsigned && (
              <div className="social-preview">
                <p>
                  <strong>Twitter</strong>
                </p>
                <div id="twitter-preview">PREVIEW HERE</div>
                <Switch
                  checked={twitter}
                  onChange={() =>
                    this.setState(prev => ({ twitter: !prev.twitter }))
                  }
                />
              </div>
            )}
            {lnsigned && (
              <div className="social-preview">
                <p>
                  <strong>LinkedIn</strong>
                </p>
                <div id="linkedin-preview">PREVIEW HERE</div>
                <Switch
                  checked={linkedin}
                  onChange={() =>
                    this.setState(prev => ({ linkedin: !prev.linkedin }))
                  }
                />
              </div>
            )}
            {!lnsigned && !twsigned && !fbsigned && (
              <div className="social-preview">
                <p>
                  <strong>
                    You are not signed into any social media accounts.
                  </strong>
                </p>
                <a href="/dashboard/social">
                  Click here to link social media accounts
                </a>
              </div>
            )}
          </div>
          {(lnsigned || twsigned || fbsigned) && (
            <BlueButton icon="upload" onClick={this.handleShare}>
              Share
            </BlueButton>
          )}
        </Dialog>
        <Dialog
          className="bp3-dialog-container"
          icon="gear"
          onClose={this.handleDialogClose2}
          title="All shared!"
          isOpen={isOpen2}
        >
          <div className="social-preview">
            <p>
              <strong>You're all set.</strong>
            </p>
            <p>Check your social media outlets to see your new blog post!</p>
          </div>
        </Dialog>
      </div>
    )
  }
}
export default SocialPoster
