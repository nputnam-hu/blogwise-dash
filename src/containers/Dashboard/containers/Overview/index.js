import React, { Component } from 'react'
import {
  Card,
  Elevation,
  Button,
  ButtonGroup,
  Spinner,
} from '@blueprintjs/core'
import moment from 'moment'
import QuestionHint from '../../../../components/QuestionHint'
import Client from '../../../../client'
import './styles.sass'

function trimString(str) {
  return str ? `${str.slice(0, 27)}...` : ''
}

class MyBlog extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      siteUrl: '',
      deploys: [],
      dataLoading: true,
      sslActivated: false,
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.client.get('/blogs/deploy').then(deploys => {
        this.setState({
          siteUrl: blog.siteUrl,
          sslActivated: blog.sslActivated,
          deploys,
          dataLoading: false,
        })
      })
    })
  }
  render() {
    const { siteUrl, sslActivated } = this.state
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
                Your Blog
              </h2>
              Your blog is located at:{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={cleanedSiteUrl}
              >
                {siteUrl}
              </a>
              <br />
              <ButtonGroup>
                <Button large icon="cog" onClick={this.props.manageSettings}>
                  Domain Settings
                </Button>
                <Button large icon="edit" onClick={this.props.viewOptions}>
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
                Your Posts
              </h2>
              Writers and admins can manage blog posts through the Content
              Management Service (CMS), located at:{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`${cleanedSiteUrl}/admin`}
              >
                {siteUrl}/admin.
              </a>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}

export default MyBlog
