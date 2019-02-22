import React, { Component } from 'react'
import { Tabs, Tab } from '@blueprintjs/core'
import Users from './sections/Users'
import Tags from './sections/Tags'
import Appearence from './sections/Appearence'
import General from './sections/General'
import './styles.sass'

class MyBlog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabId: 'first',
    }
  }
  handleTabChange = tabId => {
    this.setState({ tabId })
  }
  render() {
    return (
      <div id="myblog-container">
        <Tabs
          id="myblog-tabs"
          onChange={this.handleTabChange}
          selectedTabId={this.state.tabId}
          vertical
          large
        >
          <Tab id="first" title="Users & Roles" panel={<Users />} />
          <Tab id="second" title="Tags" panel={<Tags />} />
          <Tab id="third" title="Appearence" panel={<Appearence />} />
          <Tab id="fourth" title="General" panel={<General />} />
        </Tabs>
      </div>
    )
  }
}
export default MyBlog
