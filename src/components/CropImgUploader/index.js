import React, { Component } from 'react'
import { Dialog, FormGroup, FileInput, Button } from '@blueprintjs/core'
import Cropper from 'react-cropper'
import { uploadFileToS3 } from '../../client'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cropperjs/dist/cropper.css'
import './styles.sass'
import errorMessage from '../../toaster'

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(',')[1])

  // separate out the mime component
  const mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length)

  // create a view into the buffer
  const ia = new Uint8Array(ab)

  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i)
  }

  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], { type: mimeString })
  return blob
}

class CropImgUploader extends Component {
  constructor(props) {
    super(props)
    this.client = props.client
    this.state = {
      src: props.src || null,
      isCropping: false,
      contentType: '',
      fileName: '',
    }
  }
  handleFileUpload = e => {
    e.preventDefault()
    let files
    if (e.dataTransfer) {
      // eslint-disable-next-line prefer-destructuring
      files = e.dataTransfer.files
    } else if (e.target) {
      // eslint-disable-next-line prefer-destructuring
      files = e.target.files
    }
    const [file] = files
    const reader = new FileReader()
    reader.onload = () => {
      this.setState({
        src: reader.result,
        isCropping: true,
        contentType: file.type,
        fileName: file.name,
      })
    }
    reader.readAsDataURL(file)
  }
  cropImage = () => {
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return null
    }
    return this.cropper.getCroppedCanvas().toDataURL()
  }
  cancelCrop = () => {
    this.setState({ src: null, isCropping: false })
    this.props.handleClose()
  }
  confirmCrop = async () => {
    const dataURI = this.cropImage()
    if (!dataURI) {
      errorMessage('Could not save photo')
      return this.props.handleClose()
    }
    const croppedImg = new File([dataURItoBlob(dataURI)], this.state.fileName, {
      type: this.state.contentType,
    })
    const url = await uploadFileToS3(croppedImg, this.client)
    this.setState({ src: null, isCropping: false })
    return this.props.onConfirmCrop(url.split('?')[0])
  }
  render() {
    const { isOpen, handleClose, fileLabel, aspectRatio } = this.props
    return (
      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        title="Upload Image"
        style={{ width: '1100px' }}
      >
        <div id="modal-top">
          <Cropper
            ref={cropper => {
              this.cropper = cropper
            }}
            src={this.state.src}
            guides={false}
            aspectRatio={aspectRatio}
            style={{ height: 400, width: '100%', background: 'lightgrey' }}
            dragMode="move"
          />
        </div>
        <div id="modal-bottom">
          <br />
          <br />
          {!this.state.isCropping ? (
            <FormGroup
              htmlFor="img"
              label={fileLabel}
              helperText="For best results use an image with a transparent background"
            >
              <FileInput
                text="Choose file..."
                name="img"
                onInputChange={this.handleFileUpload}
                style={{ width: 250 }}
              />
            </FormGroup>
          ) : (
            <div id="cropmodal-buttons">
              <Button large onClick={this.cancelCrop}>
                Cancel
              </Button>
              <Button large onClick={this.confirmCrop}>
                Confirm
              </Button>
            </div>
          )}
        </div>
      </Dialog>
    )
  }
}

export default CropImgUploader
