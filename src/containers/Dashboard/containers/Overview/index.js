import React, { Component } from 'react'
import { Card, Button, ButtonGroup, Spinner } from '@blueprintjs/core'
import store from 'store'
import moment from 'moment'
import QuestionHint from '../../../../components/QuestionHint'
import WelcomeModal from '../../../../components/WelcomeModal'
import Client from '../../../../client'
import picture from './picture.svg'
import copy from './copy.svg'
import robot from '../../postgenius.svg'
import './styles.sass'

function trimString(str) {
  return str ? `${str.slice(0, 27)}...` : ''
}

class Overview extends Component {
  constructor() {
    super()
    this.client = new Client()
    const firstTime = store.get('firstTime')
    if (firstTime) {
      store.remove('firstTime')
    }
    this.state = {
      welcomeModalOpen: firstTime,
      tip: '',
      siteUrl: '',
      deploys: [],
      dataLoading: true,
      sslActivated: false,
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.setState({ siteUrl: blog.siteUrl, sslActivated: blog.sslActivated })
      this.client.get('/blogs/tip').then(tip => {
        this.setState({ tip })
        this.client.get('/blogs/deploy').then(deploys => {
          this.setState({
            deploys,
            dataLoading: false,
          })
        })
      })
    })
  }
  handleWelcomeModalClose = () => this.setState({ welcomeModalOpen: false })
  render() {
    const { siteUrl, sslActivated } = this.state
    const cleanedSiteUrl = `${
      sslActivated ? 'https' : 'http'
    }://${siteUrl.replace(/https:\/\//g, '')}`
    return (
      <div id="overview-container">
        <div id="overview-cards">
          <div className="overview-column">
            <Card className="overview-card">
              <div className="overview-card__top">
                <img
                  src={picture}
                  alt="Clouds"
                  className="overview-card__icon"
                />
                <h2>View Your Blog</h2>
              </div>
              <div style={{ padding: '0px 100px' }}>
                Your blog is located at:{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={cleanedSiteUrl}
                  style={{ color: '#447ADD' }}
                >
                  {siteUrl || <br />}
                </a>
              </div>
              <div className="overview-card__buttons">
                <Button
                  large
                  icon="cog"
                  onClick={() =>
                    this.props.history.push('/dashboard/myblog', {
                      tabId: 'fourth',
                    })
                  }
                >
                  Domain Settings
                </Button>
                <Button
                  large
                  icon="edit"
                  onClick={() =>
                    this.props.history.push('/dashboard/myblog', {
                      tabId: 'third',
                    })
                  }
                >
                  Customize
                </Button>
              </div>
            </Card>
            <div className="section-header">
              <h2>Recent Deployments</h2>
              <QuestionHint
                title="Deployments"
                helperText="Deployments are updates pushed to your website after you make changes in the admin dashboard, or after new posts are pushed to your blog via the CMS."
              />
            </div>
            {!this.state.dataLoading ? (
              <table className="bp3-html-table bp3-html-table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Deployed At</th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.deploys.map(deploy => (
                    <tr key={deploy.id}>
                      <td>
                        <b>{trimString(deploy.title)}</b>
                      </td>
                      <td>
                        {deploy.state === 'ready' ? 'Done' : deploy.state}
                      </td>
                      <td>
                        {moment(
                          deploy.published_at || deploy.created_at,
                        ).format('LLLL')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Spinner className="overview-spinner" />
            )}
          </div>
          <div className="overview-column">
            <Card className="overview-card">
              <div className="overview-card__top">
                <img
                  src={copy}
                  alt="Document"
                  className="overview-card__icon"
                />
                <h2>Manage Your Posts</h2>
              </div>
              <div style={{ padding: '0px 100px' }}>
                Writers and admins can manage blog posts through the Content
                Management Service (CMS).
              </div>
              <Button
                large
                icon="document"
                className="opencms-button"
                onClick={() => this.props.history.push('/dashboard/myposts')}
              >
                Manage Posts
              </Button>
            </Card>
            <div className="section-header">
              <h2>Post Genius Tip of the Day</h2>
            </div>
            <div className="overviewrobot-container">
              <div className="speech-bubble">
                <p>
                  <i>{this.state.tip}</i>
                </p>
              </div>
              <img
                alt="Post Genius Robot"
                src={robot}
                className="postgenius-robot"
              />
            </div>
          </div>
        </div>
        {/* Modals */}
        <WelcomeModal
          isOpen={this.state.welcomeModalOpen}
          handleClose={this.handleWelcomeModalClose}
          siteUrl={
            this.props.location.state && this.props.location.state.siteUrl
          }
        />
      </div>
    )
  }
}

export default Overview
