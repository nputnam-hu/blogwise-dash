import React, { Component } from 'react'
import store from 'store'
import EditSidebar from '../../../components/EditSidebar'
import Client from '../../../client'
import errorMessage from '../../../toaster'

class OtherInfo extends Component {
  constructor() {
    super()
    this.client = new Client()
  }
  componentDidMount() {
    if (!this.props.location.state) {
      this.props.history.push('/register')
    }
  }
  onSubmit = async state => {
    if (!state.description) {
      errorMessage('Please input a description')
      return
    }
    const { siteUrl } = await this.client.put('/blogs', state)
    await this.client.post('/blogs/deploy')
    store.set('firstTime', true)
    this.props.history.push('/dashboard', {
      tabId: 'si',
      siteUrl,
    })
  }
  onBackButtonClick = () => {
    this.props.history.push('/onboarding/2', { ...this.props.location.state })
  }
  render() {
    return (
      <EditSidebar
        onSubmit={this.onSubmit}
        onBackButtonClick={this.onBackButtonClick}
        client={this.client}
        buttonText="Submit"
        topPart={
          <>
            <div className="onboarding-stepcounter">Step 4 of 4</div>
            <h2>Build About Section</h2>
            <span className="onboarding-subheader">
              Fill in a description of what your blog is about, as well as any
              external links you want to direct readers to.
            </span>
          </>
        }
      />
    )
  }
}

export default OtherInfo
