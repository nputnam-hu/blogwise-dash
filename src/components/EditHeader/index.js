import React, { Component } from 'react'
import {
  FormGroup,
  InputGroup,
  Button,
  Intent,
  FileInput,
  Popover,
  Spinner,
  PopoverInteractionKind,
} from '@blueprintjs/core'
import { ChromePicker as ColorPicker } from 'react-color'
import { uploadFileToS3 } from '../../client'
import './styles.sass'

function getColorByBgColor(bgColor) {
  if (!bgColor) {
    return ''
  }
  return parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff'
}

const HeaderPreview = ({ title, headerPhotoUri, color }) => (
  <div style={{ background: color }} id="headercontainer">
    <div style={{ background: color }} id="headercontent">
      <img id="headerimg" alt="Your Logo Here" src={headerPhotoUri} />
      <br />
      <span style={{ color: getColorByBgColor(color) }} id="headertext">
        {title}
      </span>
    </div>
  </div>
)

class EditHeader extends Component {
  constructor(props) {
    super(props)
    this.client = props.client
    this.state = {
      title: props.title,
      headerPhotoUri: props.headerPhotoUri,
      color: props.color,
      fetchingData: props.fetchData,
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.setState({
        title: blog.title || this.props.title,
        headerPhotoUri: blog.headerPhotoUri || this.props.headerPhotoUri,
        color: blog.backgroundHexCode || this.props.backgroundHexCode,
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
  handleColorPicked = ({ hex }) => this.setState({ color: hex })

  render() {
    return (
      <div>
        <HeaderPreview
          title={this.state.title}
          headerPhotoUri={this.state.headerPhotoUri}
          color={this.state.color}
        />
        {this.state.fetchingData && <Spinner />}
        <br />
        <div className="onboarding-container">
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
              <FileInput
                text="Choose file..."
                name="headerimg"
                onInputChange={this.handleFileUpload}
                disabled={this.state.locked}
                style={{ width: 250 }}
              />
              <img
                src={this.state.headerPhotoUri}
                alt="logo preview"
                id="headerimg-preview"
              />
            </FormGroup>
            <FormGroup htmlFor="color" label="Background Color">
              <div id="colorinput">
                <div
                  id="colorpreview"
                  style={{ background: this.state.color }}
                />
                <Popover interactionKind={PopoverInteractionKind.CLICK}>
                  <Button onClick={this.openColorPicker}>Change</Button>
                  <ColorPicker
                    name="color"
                    color={this.state.color}
                    onChange={this.handleColorPicked}
                  />
                </Popover>
              </div>
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
        </div>
      </div>
    )
  }
}

export default EditHeader
