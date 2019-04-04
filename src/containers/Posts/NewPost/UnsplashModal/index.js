import React, { Component } from 'react'
import { Drawer, Spinner, Intent, Button, InputGroup } from '@blueprintjs/core'
import Unsplash, { toJson } from 'unsplash-js'
import Gallery from 'react-grid-gallery'
import './styles.sass'

const WAIT_INTERVAL = 1000
const ENTER_KEY = 13

const unsplash = new Unsplash({
  applicationId:
    '1d299ca9a3d91f7431e544097fee081455f23f616ce2ddd3658600d18894f97c',
  secret: 'e04d229aca02635d3aebb77d42423041ccd9d319c11fc95fb28f76c84b72cbb4',
})

class UnsplashModal extends Component {
  constructor() {
    super()
    this.state = {
      images: [],
      dataLoading: true,
      selectedIndex: -1,
      query: '',
      selectedPhoto: '',
    }
  }
  componentWillMount() {
    this.timer = null
  }
  onClick = () => {
    const selectedImage = this.state.images[this.state.selectedIndex]
    this.props.onConfirmImage(selectedImage)
    this.props.handleClose()
  }
  search = query => {
    this.setState({ searching: true })
    clearTimeout(this.timer)
    this.setState({ query })
    this.timer = setTimeout(this.searchForPhotos, WAIT_INTERVAL)
  }
  handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY) {
      this.searchForPhotos()
    }
  }
  searchForPhotos = () => {
    this.setState({ searching: false })
    unsplash.search
      .photos(this.state.query, 1, 15)
      .then(toJson)
      .then(unsplashPhotos => {
        const images = this.mapUnsplashToReactGallery(unsplashPhotos.results)
        this.setState({ images, dataLoading: false })
      })
  }
  mapUnsplashToReactGallery = images =>
    images.map(image => {
      const aspectRatio = image.width / image.height
      return {
        src: image.urls.regular,
        thumbnail: image.urls.thumb,
        thumbnailWidth: 200 * aspectRatio,
        thumbnailHeight: 200,
        caption: `By ${image.user.username} on unsplash`,
        downloadLink: image.links.download,
      }
    })
  selectImage = index => {
    const newImages = this.state.images.map((image, i) => ({
      ...image,
      isSelected: i === index ? !image.isSelected : false,
    }))
    this.setState({
      images: newImages,
      selectedIndex: newImages[index].isSelected ? index : -1,
    })
  }
  render() {
    const { isOpen, handleClose } = this.props
    return (
      <Drawer
        icon="media"
        isOpen={isOpen}
        onClose={handleClose}
        title="Cover Photo Suggestions"
        onOpening={() => {
          this.search(this.props.query)
        }}
      >
        {this.state.dataLoading ? (
          <>
            <div style={{ height: '30px' }} />
            <Spinner />
          </>
        ) : (
          <div className="photos">
            <InputGroup
              className="photos__searchbar"
              name="query"
              value={this.state.query}
              onChange={e => this.search(e.target.value)}
              leftIcon="search"
              large
            />
            {this.state.searching ? (
              <>
                <div style={{ height: '30px' }} />
                <Spinner />
              </>
            ) : (
              <Gallery
                images={this.state.images}
                enableLightbox={false}
                onSelectImage={this.selectImage}
                onClickThumbnail={this.selectImage}
              />
            )}
            <div className="photos__footer">
              <Button
                intent={Intent.PRIMARY}
                onClick={this.onClick}
                disabled={this.state.selectedIndex < 0}
              >
                Use This Photo
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    )
  }
}

export default UnsplashModal
