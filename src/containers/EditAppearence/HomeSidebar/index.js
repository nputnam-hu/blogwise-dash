import React, { Component } from 'react'
import EditSidebar from '../../../components/EditSidebar'
import Client from '../../../client'
import errorMessage from '../../../errorMessage'

class HomeSidebar extends Component {
  constructor() {
    super()
    this.client = new Client()
  }
  onSubmit = async state => {
    try {
      await this.client.put('/blogs', state)
      this.props.history.push('/dashboard', {
        tabId: 'si',
      })
    } catch (err) {
      errorMessage('Failed to update blog')
    }
  }
  onBackButtonClick = () => {
    this.props.history.push('/dashboard')
  }
  render() {
    return (
      <EditSidebar
        client={this.client}
        onSubmit={this.onSubmit}
        onBackButtonClick={this.onBackButtonClick}
        buttonText="Save"
        rightIcon="floppy-disk"
        topPart={
          <>
            <h2 style={{ marginBottom: '-15px' }}>Edit Sidebar</h2>
          </>
        }
      />
    )
  }
}

export default HomeSidebar
