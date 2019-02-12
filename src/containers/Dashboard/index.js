import React, { Component } from 'react'
import store from 'store'
import Account from './containers/Account'
import Users from './containers/Users'
import Integrations from './containers/Integrations'
import SiteInfo from './containers/SiteInfo'

import { Tab, Tabs } from '@blueprintjs/core'
import './styles.sass'

class Home extends Component {
  state = {
    tabId: 'us',
  }
  handleTabChange = tabId => {
    this.setState({ tabId })
  }
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
      </div>
    )
  }
}

export default Home
