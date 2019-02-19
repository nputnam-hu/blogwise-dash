import React, { Component } from 'react'
import Account from './containers/Account'
import Users from './containers/Users'
import Integrations from './containers/Integrations'
import SiteInfo from './containers/SiteInfo'
import WelcomeModal from '../../components/WelcomeModal'

import { Tab, Tabs } from '@blueprintjs/core'
import './styles.sass'

class Home extends Component {
  constructor() {
    super()
    this.state = {
      tabId: 'si',
      welcomeModalOpen: true,
      // this.props.location.state && this.props.location.state.firstTime,
    }
  }
  handleTabChange = tabId => {
    this.setState({ tabId })
  }
  handleWelcomeModalClose = () => this.setState({ welcomeModalOpen: false })
  render() {
    return (
      <div id="index-container">
        <Tabs
          id="TabsExample"
          onChange={this.handleTabChange}
          selectedTabId={this.state.tabId}
          large
          vertical
        >
          <Tab id="si" title="Site Info" panel={<SiteInfo />} />
          <Tab id="us" title="Users & Roles" panel={<Users />} />
          <Tab id="in" title="Integrations" panel={<Integrations />} />
          <Tab id="ac" title="Account" panel={<Account />} />
          <Tabs.Expander />
        </Tabs>
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

export default Home
