import React, { Component } from 'react'
import {
  FormGroup,
  InputGroup,
  TextArea,
  Button,
  Intent,
  ControlGroup,
  Spinner,
} from '@blueprintjs/core'
import normalizeUrl from 'normalize-url'
import CropImgUploader from '../CropImgUploader'
import SidebarPreview from '../SidebarPreview'
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
      companyName: '',
      tags: {},
      fetchingData: true,
      cropModalOpen: false,
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.setState({
        description: blog.description || '',
        companyName: blog.companyName || '',
        mainSiteUrl: blog.mainSiteUrl || '',
        facebookUrl: blog.facebookUrl || '',
        twitterUrl: blog.twitterUrl || '',
        linkedinUrl: blog.linkedinUrl || '',
        sidebarPhotoUri: blog.sidebarPhotoUri || '',
        tags: blog.tags || {},
        fetchingData: false,
      })
    })
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onClick = () => {
    const sidebar = { ...this.state }
    try {
      sidebar.mainSiteUrl = normalizeUrl(sidebar.mainSiteUrl)
    } catch (e) {
      sidebar.mainSiteUrl = ''
    }
    this.props.onSubmit(sidebar)
  }
  openCropModal = () => this.setState({ cropModalOpen: true })
  handleCropModalClose = () => this.setState({ cropModalOpen: false })
  render() {
    const enteredValues =
      this.state.description ||
      this.state.mainSiteUrl ||
      this.state.facebookUrl ||
      this.state.linkedinUrl
    return (
      <>
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
                />
              </FormGroup>
              <FormGroup
                htmlFor="sidebarimg"
                label="Sidebar Logo"
                helperText="For best results use an image with a transparent or white background"
              >
                <Button
                  text="Choose file..."
                  name="sidebarimg"
                  onClick={this.openCropModal}
                />
                <img
                  src={this.state.sidebarPhotoUri}
                  alt="logo preview"
                  id="sidebarimg-preview"
                />
              </FormGroup>
              <FormGroup
                htmlFor="companyName"
                label="Company Name"
                helperText="The name you want readers to know your company by"
              >
                <InputGroup
                  name="companyName"
                  value={this.state.companyName}
                  onChange={this.onChange}
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
                  />
                </ControlGroup>
              </FormGroup>
              <br />
              <Button
                large
                rightIcon={this.props.rightIcon || 'arrow-right'}
                intent={Intent.PRIMARY}
                onClick={this.onClick}
              >
                {this.props.buttonText}
              </Button>
            </div>
            {enteredValues && (
              <>
                {this.state.fetchingData && <Spinner />}
                <SidebarPreview
                  tags={Object.values(this.state.tags)}
                  logoUri={this.state.sidebarPhotoUri}
                  description={this.state.description}
                  twitterUrl={this.state.twitterUrl}
                  facebookUrl={this.state.facebookUrl}
                  linkedinUrl={this.state.linkedinUrl}
                  companyName={this.state.companyName}
                />
              </>
            )}
          </div>
        </div>
        {/* Modals */}
        <CropImgUploader
          isOpen={this.state.cropModalOpen}
          handleClose={this.handleCropModalClose}
          client={this.props.client}
          fileLabel="Sidebar Photo"
          onConfirmCrop={url =>
            this.setState({ sidebarPhotoUri: url, cropModalOpen: false })
          }
        />
      </>
    )
  }
}

export default EditSidebar
