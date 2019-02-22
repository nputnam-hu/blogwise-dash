import React, { Component } from 'react'
import {
  FormGroup,
  InputGroup,
  TextArea,
  Button,
  Intent,
  ControlGroup,
  Spinner,
  FileInput,
} from '@blueprintjs/core'
import SidebarPreview from '../SidebarPreview'
import { uploadFileToS3 } from '../../client'
import './styles.sass'

class EditSidebar extends Component {
  constructor(props) {
    super(props)
    this.client = props.client
    this.state = {
      description: '',
      mainSiteUrl: '',
      facebookUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
      sidebarPhotoUri: '',
      tags: {},
      fetchingData: true,
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.setState({
        description: blog.description,
        mainSiteUrl: blog.mainSiteUrl,
        facebookUrl: blog.facebookUrl,
        twitterUrl: blog.twitterUrl,
        linkedinUrl: blog.linkedinUrl,
        sidebarPhotoUri: blog.sidebarPhotoUri,
        tags: blog.tags,
        fetchingData: false,
      })
    })
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  handleFileUpload = evt => {
    const { files } = evt.target
    const file = files[0]
    if (file) {
      uploadFileToS3(file, this.client).then(url =>
        this.handlePhotoUploaded(url.split('?')[0]),
      )
    }
  }
  handlePhotoUploaded = url => {
    this.setState({ sidebarPhotoUri: url })
  }
  render() {
    const enteredValues =
      this.state.description ||
      this.state.mainSiteUrl ||
      this.state.facebookUrl ||
      this.state.linkedinUrl
    return (
      <div id="otherinfo-container">
        <div
          className="onboarding-container otherinfo"
          style={
            enteredValues
              ? {
                  margin: '10px 10% 0px',
                }
              : {}
          }
        >
          <Button
            small
            icon="arrow-left"
            className="onboarding-backbutton"
            minimal
            onClick={this.props.onBackButtonClick}
          >
            Back
          </Button>
          {this.props.topPart}
          <div className="onboarding-form">
            <FormGroup
              htmlFor="description"
              label="Description"
              labelInfo="(required)"
            >
              <TextArea
                name="description"
                value={this.state.description || ''}
                onChange={this.onChange}
                fill
                style={{ resize: 'none' }}
                disabled={this.state.locked}
              />
            </FormGroup>
            <FormGroup
              htmlFor="sidebarimg"
              label="Sidebar Logo"
              helperText="For best results use an image with a transparent or white background"
            >
              <FileInput
                text="Choose file..."
                name="sidebarimg"
                onInputChange={this.handleFileUpload}
                style={{ width: 250 }}
              />
              <img
                src={this.state.sidebarPhotoUri}
                alt="logo preview"
                id="sidebarimg-preview"
              />
            </FormGroup>
            <FormGroup
              htmlFor="mainSiteUrl"
              label="Website Link"
              helperText="A link to your primary website"
            >
              <InputGroup
                name="mainSiteUrl"
                value={this.state.mainSiteUrl}
                onChange={this.onChange}
                disabled={this.state.locked}
              />
            </FormGroup>
            <FormGroup
              htmlFor="twitterUrl"
              label="Twitter URL"
              helperText="A link to your company's twitter account"
            >
              <ControlGroup>
                <span className="urlStart">www.twitter.com/</span>
                <InputGroup
                  name="twitterUrl"
                  style={{ paddingLeft: 2 }}
                  value={this.state.twitterUrl}
                  onChange={this.onChange}
                  disabled={this.state.locked}
                />
              </ControlGroup>
            </FormGroup>
            <FormGroup
              htmlFor="facebookUrl"
              label="Facebook URL"
              helperText="A link to your company's facebook page"
            >
              <ControlGroup>
                <span className="urlStart">www.facebook.com/</span>
                <InputGroup
                  name="facebookUrl"
                  style={{ paddingLeft: 2 }}
                  value={this.state.facebookUrl}
                  onChange={this.onChange}
                  disabled={this.state.locked}
                />
              </ControlGroup>
            </FormGroup>
            <FormGroup
              htmlFor="linkedinUrl"
              label="LinkedIn URL"
              helperText="A link to your company's LinkedIn Profile"
            >
              <ControlGroup>
                <span className="urlStart">www.linkedin.com/</span>
                <InputGroup
                  name="linkedinUrl"
                  style={{ paddingLeft: 2 }}
                  value={this.state.linkedinUrl}
                  onChange={this.onChange}
                  disabled={this.state.locked}
                />
              </ControlGroup>
            </FormGroup>
            <br />
            <Button
              large
              rightIcon={this.props.rightIcon || 'arrow-right'}
              intent={Intent.PRIMARY}
              onClick={() => this.props.onSubmit(this.state)}
            >
              {this.props.buttonText}
            </Button>
          </div>
          {enteredValues && (
            <>
              {this.state.fetchingData && <Spinner />}
              <SidebarPreview
                tags={Object.values(this.state.tags)}
                logoUri={
                  console.log(this.state.sidebarPhotoUri) ||
                  this.state.sidebarPhotoUri
                }
                description={this.state.description}
                twitterUrl={this.state.twitterUrl}
                facebookUrl={this.state.facebookUrl}
                linkedinUrl={this.state.linkedinUrl}
              />
            </>
          )}
        </div>
      </div>
    )
  }
}

export default EditSidebar
