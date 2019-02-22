import React, { Component } from 'react'
import { FormGroup, FileInput } from '@blueprintjs/core'
import QuestionHint from '../../../../../../components/QuestionHint'
import Client, { uploadFileToS3 } from '../../../../../../client'
import './styles.sass'

class General extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      faviconPhotoUri: '',
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.setState({ faviconPhotoUri: blog.faviconPhotoUri })
    })
  }
  handleFileUpload = evt => {
    const { files } = evt.target
    const file = files[0]
    if (file) {
      uploadFileToS3(file, this.client).then(url =>
        this.handlePhotoUploaded(url.split('?')[0]),
      )
    }
  }

  handlePhotoUploaded = async url => {
    this.setState({ faviconPhotoUri: url })
    await this.client.put('/blogs', {
      faviconPhotoUri: this.state.faviconPhotoUri,
    })
  }
  render() {
    return (
      <div id="generalmyblog-container">
        <h2>General Settings</h2>
        <div className="section-header">
          <h3>Favicon</h3>
          <QuestionHint
            title="Favicon"
            helperText="The favicon is the tiny icon displayed in your readers browser tabs. For best results use png or ico format."
          />
        </div>
        <FormGroup
          htmlFor="Favicon Photo"
          label=""
          helperText="For best results, please use a small (32px by 32px) png or ico asset"
        >
          {this.state.faviconPhotoUri && (
            <div>
              <img
                style={{
                  height: '35px',
                  marginTop: '5px',
                  marginBottom: '5px',
                }}
                src={this.state.faviconPhotoUri}
                alt="logo preview"
              />
              <br />
            </div>
          )}
          <FileInput
            text="Choose file..."
            onInputChange={this.handleFileUpload}
          />
        </FormGroup>
      </div>
    )
  }
}

export default General
