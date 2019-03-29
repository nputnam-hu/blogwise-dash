import React, { Component } from 'react'
import EditHeader from '../../../components/EditHeader'
import config from '../../../config'
import Client from '../../../client'
import errorMessage from '../../../toaster'

class Header extends Component {
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
    try {
      await this.client.put('/blogs', {
        title: state.title,
        headerPhotoUri: state.headerPhotoUri,
        sidebarPhotoUri: state.headerPhotoUri,
        backgroundHexCode: state.backgroundHexCode,
        bgImgUri: state.bgImgUri,
      })
      this.props.history.push('/onboarding/2', {
        ...this.props.location.state,
      })
    } catch (err) {
      errorMessage('Failed to update blog')
    }
  }
  onBackButtonClick = () => {
    this.props.history.push('/plans', { ...this.props.location.state })
  }
  render() {
    return (
      <EditHeader
        client={this.client}
        onSubmit={this.onSubmit}
        onBackButtonClick={this.onBackButtonClick}
        buttonText="Next Step"
        title="Your Title Here"
        headerPhotoUri={config.defaultLogo}
        backgroundHexCode="#ffffff"
        topPart={
          <>
            <div className="onboarding-stepcounter">Step 2 of 4</div>
            <h2>Build Home Page</h2>
            <span className="onboarding-subheader">
              Customize the home page of your blog to give customers a full
              sense of what your blog is about
            </span>
          </>
        }
      />
    )
  }
}

export default Header
