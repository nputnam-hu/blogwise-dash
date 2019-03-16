import React, { Component } from 'react'
import { Dialog, Button, Intent } from '@blueprintjs/core'
import writing from './writing.svg'
import dashboard from './dashboard.svg'
import robot from './robot.png'
import './styles.sass'

const PanelOne = ({ onClick, siteUrl }) => (
  <div className="panel-container">
    <h1>
      <span role="img" aria-label="Confetti">
        🎉
      </span>{' '}
      Welcome to blogwise!{' '}
      <span role="img" aria-label="Confetti">
        🎉
      </span>
    </h1>
    <img alt="Blogwise Robot" src={robot} />
    <p>
      Your blog is live! It's been set up based off of the infromation provided
      when you registered your account. You can access it{' '}
      <a target="_blank" rel="noopener noreferrer" href={siteUrl}>
        here
      </a>{' '}
      (Don't worry you can set it to go to a custom URL later).
    </p>
    <Button
      className="panel-button"
      large
      intent={Intent.SUCCESS}
      rightIcon="arrow-right"
      onClick={onClick}
    >
      Next
    </Button>
  </div>
)

const PanelThree = ({ onClick, siteUrl }) => (
  <div className="panel-container">
    <h1>Manage Your Content</h1>
    <p>There are two places to manage your blog:</p>
    <div className="panelthree__graphics">
      <div className="panelthree__graphic">
        <img className="graphic__img" alt="Dashboard" src={dashboard} />
        <h3>The Admin Dashboard</h3>
        <br />
        <p>
          Located here at app.blogwise.co, the dashboard is accessible only to
          team admins and is where you can customize the appearance of the blog,
          invite users, and manage organizational settings
        </p>
      </div>
      <div className="panelthree__graphic">
        <img className="graphic__img" alt="Pen" src={writing} />
        <h3>The Blog Content Management Service (CMS)</h3>
        <p>
          Located at your_blog.com/admin, the blog CMS is accessible by admins
          and writers, and is where new blog posts are written and published to
          the blog. You can check it out right now{' '}
          <a
            href={`${siteUrl}/admin`}
            rel="noopener noreferrer"
            target="_blank"
          >
            here
          </a>
          .
        </p>
      </div>
    </div>
    <Button
      className="panel-button"
      large
      intent={Intent.PRIMARY}
      onClick={onClick}
    >
      Done
    </Button>
  </div>
)

class WelcomeModal extends Component {
  constructor(props) {
    super(props)
    this.panels = [
      <PanelOne onClick={this.nextPanel(0)} siteUrl={props.siteUrl} />,
      <PanelThree onClick={this.nextPanel(1)} siteUrl={props.siteUrl} />,
    ]
    this.state = {
      currentPanel: 0,
      isOpen: props.isOpen,
    }
  }
  nextPanel = i => () =>
    i + 1 >= this.panels.length
      ? this.setState({ isOpen: false })
      : this.setState({ currentPanel: i + 1 })

  render() {
    return (
      <Dialog
        isOpen={this.state.isOpen}
        onClose={this.props.handleClose}
        style={{ width: '750px', height: '600px' }}
      >
        <div id="welcomemodal-container">
          {this.panels[this.state.currentPanel]}
        </div>
      </Dialog>
    )
  }
}
export default WelcomeModal
