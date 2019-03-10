import React, { Component } from 'react'
import {
  FormGroup,
  InputGroup,
  Button,
  Intent,
  Popover,
  Spinner,
  PopoverInteractionKind,
  RadioGroup,
  Radio,
} from '@blueprintjs/core'
import { ChromePicker as ColorPicker } from 'react-color'
import CropImgUploader from '../CropImgUploader'
import HeaderPreview from '../HeaderPreview'
import { uploadFileToS3 } from '../../client'
import './styles.sass'

class EditHeader extends Component {
  constructor(props) {
    super(props)
    this.client = props.client
    this.state = {
      title: props.title,
      headerPhotoUri: props.headerPhotoUri,
      backgroundHexCode: props.backgroundHexCode,
      bgImgUri: props.bgImgUri,
      cropModalOpen: false,
      bgCropModalOpen: false,
      fetchingData: props.fetchData,
      bgType: props.bgImgUri ? 'img' : 'color',
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.setState({
        title: blog.title || this.props.title,
        headerPhotoUri: blog.headerPhotoUri || this.props.headerPhotoUri,
        bgImgUri: blog.bgImgUri || this.props.bgImgUri,
        bgType: blog.bgImgUri || this.props.bgImgUri ? 'img' : 'color',
        backgroundHexCode:
          blog.backgroundHexCode || this.props.backgroundHexCode,
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
    this.setState({ headerPhotoUri: url })
  }
  handleColorPicked = ({ hex }) =>
    this.setState({ backgroundHexCode: hex, bgImgUri: '' })
  handleBgTypeChange = e => this.setState({ bgType: e.currentTarget.value })
  openCropModal = () => this.setState({ cropModalOpen: true })
  handleCropModalClose = () => this.setState({ cropModalOpen: false })
  openBgCropModal = () => this.setState({ bgCropModalOpen: true })
  handleBgCropModalClose = () => this.setState({ bgCropModalOpen: false })
  render() {
    return (
      <div style={{ marginTop: '25px' }}>
        <HeaderPreview
          title={this.state.title}
          headerPhotoUri={this.state.headerPhotoUri}
          bgImgUri={this.state.bgImgUri}
          color={this.state.backgroundHexCode}
        />
        {this.state.fetchingData && <Spinner />}
        <br />
        <div className="onboarding-container editheader">
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
          <div className="onboarding-form editheader">
            <div className="editheader-inputs">
              <div style={{ flexDirection: 'column' }}>
                <FormGroup htmlFor="title" label="Title">
                  <InputGroup
                    name="title"
                    value={this.state.title}
                    onChange={this.onChange}
                    autoFocus
                  />
                </FormGroup>
                <FormGroup
                  htmlFor="headerimg"
                  label="Logo"
                  helperText="For best results use an image with a transparent background"
                >
                  <Button
                    text="Choose file..."
                    name="headerimg"
                    onClick={this.openCropModal}
                  />
                  <img
                    src={this.state.headerPhotoUri}
                    alt="logo preview"
                    id="headerimg-preview"
                  />
                </FormGroup>
              </div>
              <div style={{ flexDirection: 'column' }}>
                <h4>Background</h4>
                <RadioGroup
                  onChange={this.handleBgTypeChange}
                  selectedValue={this.state.bgType}
                  inline
                >
                  <Radio label="Solid Color" value="color" />
                  <Radio label="Background Image" value="img" />
                </RadioGroup>
                <br />
                {this.state.bgType === 'color' ? (
                  <FormGroup htmlFor="color" label="Solid Color">
                    <div id="colorinput">
                      <div
                        id="colorpreview"
                        style={{ background: this.state.backgroundHexCode }}
                      />
                      <Popover interactionKind={PopoverInteractionKind.CLICK}>
                        <Button>Change</Button>
                        <ColorPicker
                          name="color"
                          color={this.state.backgroundHexCode}
                          onChange={this.handleColorPicked}
                        />
                      </Popover>
                    </div>
                  </FormGroup>
                ) : (
                  <FormGroup htmlFor="bgimg" label="Background Image ">
                    <Button
                      text="Choose file..."
                      name="bgimg"
                      onClick={this.openBgCropModal}
                    />
                  </FormGroup>
                )}
              </div>
            </div>
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
        </div>
        {/* Modals */}
        <CropImgUploader
          isOpen={this.state.cropModalOpen}
          handleClose={this.handleCropModalClose}
          client={this.client}
          fileLabel="Header Photo"
          onConfirmCrop={url =>
            this.setState({ headerPhotoUri: url, cropModalOpen: false })
          }
        />
        <CropImgUploader
          isOpen={this.state.bgCropModalOpen}
          handleClose={this.handleBgCropModalClose}
          client={this.client}
          fileLabel="Background Image"
          onConfirmCrop={url =>
            this.setState({ bgImgUri: url, bgCropModalOpen: false })
          }
        />
      </div>
    )
  }
}

export default EditHeader
