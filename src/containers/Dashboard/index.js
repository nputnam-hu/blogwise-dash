import React, { Component } from 'react'
import store from 'store'
import Account from './containers/Account'
import DomainSettings from './containers/DomainSettings'
import Overview from './containers/Overview'
import MyBlog from './containers/MyBlog'
import WelcomeModal from '../../components/WelcomeModal'

import { Tab, Tabs } from '@blueprintjs/core'
import './styles.sass'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    const firstTime = store.get('firstTime')
    if (firstTime) store.remove('firstTime')
    this.state = {
      tabId:
        props.location.state && props.location.state.tabId
          ? props.location.state.tabId
          : 'ac',
      welcomeModalOpen: firstTime,
    }
  }
  handleTabChange = tabId => {
    this.setState({ tabId })
  }
  handleWelcomeModalClose = () => this.setState({ welcomeModalOpen: false })
  manageSettings = () => this.setState({ tabId: 'us' })
  viewOptions = () => this.setState({ tabId: 'si' })
  render() {
    return (
      <div id="index-container" className="tab-container">
        <Tabs
          id="TabsExample"
          className="dashboard-tabs"
          onChange={this.handleTabChange}
          selectedTabId={this.state.tabId}
          large
        >
          <Tab
            className="dashboard-tab"
            id="in"
            title="Overview"
            panel={
              <Overview
                manageSettings={this.manageSettings}
                viewOptions={this.viewOptions}
              />
            }
          />
          <Tab
            className="dashboard-tab"
            id="si"
            title="My Blog"
            panel={<MyBlog />}
          />
          <Tab
            className="dashboard-tab"
            id="us"
            title="Domain Settings"
            panel={<DomainSettings />}
          />
          <Tab
            className="dashboard-tab"
            id="ac"
            title="Account"
            panel={<Account />}
          />
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

export default Dashboard
