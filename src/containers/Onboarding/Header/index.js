import React, { Component } from 'react'
import {
  FormGroup,
  InputGroup,
  Button,
  Intent,
  FileInput,
  Popover,
  PopoverInteractionKind,
} from '@blueprintjs/core'
import { ChromePicker as ColorPicker } from 'react-color'
import axios from 'axios'
import config from '../../../config'
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
      <img id="headerimg" alt="Kaldi Logo" src={headerPhotoUri} />
      <br />
      <span style={{ color: getColorByBgColor(color) }} id="headertext">
        {title}
      </span>
    </div>
  </div>
)

class Header extends Component {
  state = {
    title: 'Your Title Here',
    headerPhotoUri:
      'https://s3.amazonaws.com/megaphone-logo-uploads/1549559463864_blogwise_logo.png',
    color: '#E6E6E6',
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onClick = () => {
    this.props.history.push('/onboarding/2', {
      ...this.props.location.state,
      ...this.state,
    })
  }
  handleFileUpload = evt => {
    const { files } = evt.target
    const file = files[0]
    if (file) {
      const options = {
        headers: {
          'Content-Type': file.type,
        },
      }
      axios
        .put(`${config.apiUrl}/s3/logo`, {
          fileName: `${Date.now()}_${file.name}`,
          contentType: file.type,
        })
        .then(({ data: url }) => {
          axios
            .put(url, file, options)
            .then(() => this.handlePhotoUploaded(url.split('?')[0]))
        })
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
        <br />
        <div className="onboarding-container">
          <div className="onboarding-stepcounter">Step 2 of 5</div>
          <h2>Build Home Page</h2>
          <span className="onboarding-subheader">
            Customize the home page of your blog to give customers a full sense
            of what your blog is about
          </span>
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
              label="Header Image"
              helperText="For best results use an image with a transparent background"
            >
              <FileInput
                text="Choose file..."
                name="headerimg"
                onInputChange={this.handleFileUpload}
                disabled={this.state.locked}
                style={{ width: 250 }}
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
              rightIcon="arrow-right"
              intent={Intent.PRIMARY}
              onClick={this.onClick}
            >
              Next Step
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default Header
