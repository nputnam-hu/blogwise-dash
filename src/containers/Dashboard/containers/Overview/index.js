import React, { Component } from 'react'
import {
  Card,
  Elevation,
  Button,
  ButtonGroup,
  Spinner,
} from '@blueprintjs/core'
import store from 'store'
import moment from 'moment'
import QuestionHint from '../../../../components/QuestionHint'
import WelcomeModal from '../../../../components/WelcomeModal'
import Client from '../../../../client'
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
      siteUrl: '',
      deploys: [],
      dataLoading: true,
      sslActivated: false,
      headlines: [],
    }
  }
  componentDidMount() {
    this.client.post('/blogs/content').then(headlines => {
      this.client.get('/blogs').then(blog => {
        this.client.get('/blogs/deploy').then(deploys => {
          this.setState({
            siteUrl: blog.siteUrl,
            sslActivated: blog.sslActivated,
            deploys,
            headlines,
            dataLoading: false,
          })
        })
      })
    })
  }
  handleWelcomeModalClose = () => this.setState({ welcomeModalOpen: false })
  render() {
    const { siteUrl, sslActivated, headlines } = this.state
    const cleanedSiteUrl = `${
      sslActivated ? 'https' : 'http'
    }://${siteUrl.replace(/https:\/\//g, '')}`
    return (
      <div id="overview-container">
        <div id="overview-cards">
          <div className="overview-column">
            <Card className="overview-card" elevation={Elevation.ONE}>
              <h2>
                <span role="img" aria-label="computer">
                  💻
                </span>{' '}
                View Your Blog
              </h2>
              Your blog is located at:{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={cleanedSiteUrl}
              >
                {siteUrl || <br />}
              </a>
              <br />
              <ButtonGroup>
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
              </ButtonGroup>
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
            <Card className="overview-card" elevation={Elevation.ONE}>
              <h2>
                <span role="img" aria-label="memo">
                  📝
                </span>{' '}
                Manage Your Posts
              </h2>
              Writers and admins can manage blog posts through the Content
              Management Service (CMS), located at:{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="opencms-button"
                href={`${cleanedSiteUrl}/admin`}
              >
                <Button large icon="document">
                  Manage Posts
                </Button>
              </a>
            </Card>
            <div className="section-header">
              <h2>Suggested Articles</h2>
            </div>
            {headlines.length > 0 && (
              <ul>
                {headlines.map(headline => (
                  <li className="headline-container">
                    <span className="headline">{headline}</span>
                  </li>
                ))}
              </ul>
            )}
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
