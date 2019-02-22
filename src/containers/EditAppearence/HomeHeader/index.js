import React, { Component } from 'react'
import EditHeader from '../../../components/EditHeader'
import Client from '../../../client'
import errorMessage from '../../../errorMessage'

class HomeHeader extends Component {
  constructor() {
    super()
    this.client = new Client()
  }
  onSubmit = async state => {
    try {
      await this.client.put('/blogs', {
        title: state.title,
        headerPhotoUri: state.headerPhotoUri,
        backgroundHexCode: state.color,
      })
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
      <EditHeader
        client={this.client}
        onSubmit={this.onSubmit}
        onBackButtonClick={this.onBackButtonClick}
        buttonText="Save"
        rightIcon="floppy-disk"
        fetchData
        topPart={
          <>
            <h2 style={{ marginBottom: '-15px' }}>Edit Homepage Header</h2>
          </>
        }
      />
    )
  }
}

export default HomeHeader
