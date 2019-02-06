import React, { Component } from 'react'
import {
  InputGroup,
  TextArea,
  FormGroup,
  ControlGroup,
  Button,
  ButtonGroup,
  H5,
  Card,
  Intent,
  Alert,
  FileInput,
  Icon,
  Text,
} from '@blueprintjs/core'
import axios from 'axios'
import config from '../../../../config'
import QuestionHint from '../../../../components/QuestionHint'
import TagModal from './components/TagModal'
import SideBarPreview from './previews/SideBar'
import { loadUser, saveUser } from './utils'
import './styles.sass'

class SiteInfo extends Component {
  state = {
    locked: true,
    title: '',
    description: '',
    facebookUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    siteUrl: '',
    tags: {},
    logoUri: '',
    modalOpen: false,
    modalIsEdit: '',
    modalTagName: '',
    modalTagDescription: '',
    modalTagKey: '',
    alertOpen: false,
    deleteKey: '',
    cancelChangesAlertOpen: false,
    saveChangesAlertOpen: false,
  }

  componentDidMount() {
    this.setInitialState()
    window.addEventListener('beforeunload', this.onUnload)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload)
  }

  // eslint-disable-next-line consistent-return
  onUnload = e => {
    if (!this.state.locked) {
      const confirmMessage =
        'Are you sure you want to leave the page without saving changes?'
      e.returnValue = confirmMessage
      return confirmMessage
    }
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })

  setInitialState = () =>
    loadUser().then(userInfo => {
      this.setState({ ...userInfo })
    })

  toggleLock = () => this.setState({ locked: false })

  handleCancelChanges = () => this.setState({ cancelChangesAlertOpen: true })
  handleCancelCancelAlert = () =>
    this.setState({ cancelChangesAlertOpen: false })
  handleConfirmCancelAlert = () => {
    this.setInitialState()
    this.setState({ cancelChangesAlertOpen: false, locked: true })
  }

  handleSaveChanges = () => this.setState({ saveChangesAlertOpen: true })
  handleCancelSaveAlert = () => this.setState({ saveChangesAlertOpen: false })
  handleConfirmSaveAlert = () => {
    saveUser(this.state)
    this.setState({ saveChangesAlertOpen: false, locked: true })
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
    this.setState({ logoUri: url })
  }

  openModalNew = () =>
    this.setState({
      modalOpen: true,
      modalIsEdit: false,
      modalTagName: '',
      modalTagDescription: '',
      modalTagKey: '',
    })
  openModalEdit = tagKey =>
    this.setState({
      modalOpen: true,
      modalIsEdit: true,
      modalTagName: this.state.tags[tagKey].name,
      modalTagDescription: this.state.tags[tagKey].description,
      modalTagKey: tagKey,
    })
  handleClose = () => this.setState({ modalOpen: false })

  modifyTag = (tagKey, newTag) =>
    this.setState({
      modalOpen: false,
      tags: { ...this.state.tags, [tagKey]: newTag },
    })

  openAlert = tagKey => this.setState({ alertOpen: true, deleteKey: tagKey })
  handleAlertClose = () => this.setState({ alertOpen: false, deleteKey: '' })
  handleMoveConfirm = () => {
    const newTags = { ...this.state.tags }
    delete newTags[this.state.deleteKey]
    this.setState({
      alertOpen: false,
      tags: newTags,
      deleteKey: '',
    })
  }

  render() {
    return (
      <div id="siteinfo-container">
        <div id="inputcontent">
          <h1>Site Info</h1>
          <div
            id="unlock-container"
            onClick={this.toggleLock}
            onKeyDown={this.toggleLock}
            role="button"
            tabIndex="0"
          >
            <Icon
              icon={this.state.locked ? 'lock' : 'unlock'}
              iconSize={16}
              color="#5C7081"
            />
            <Text>
              {this.state.locked
                ? 'Click the lock to make changes'
                : 'Click below to finish making changes or cancel'}
            </Text>
          </div>
          {!this.state.locked && (
            <div id="savebuttons">
              <Button icon="cross" onClick={this.handleCancelChanges}>
                Discard Changes
              </Button>
              <Button icon="floppy-disk" onClick={this.handleSaveChanges}>
                Save
              </Button>
            </div>
          )}
          <div className="section-header">
            <h2>Basic Info</h2>
            <QuestionHint
              title="Basic Info"
              helperText="This info will be used to inform users about the purpose of your blog so they can better understand it. It will also be indexed by search engines and will be displayed in Google results."
            />
          </div>
          <FormGroup htmlFor="title" label="Title" labelInfo="(required)">
            <InputGroup
              name="title"
              value={this.state.title}
              onChange={this.onChange}
              disabled={this.state.locked}
            />
          </FormGroup>
          <FormGroup
            htmlFor="description"
            label="Description"
            labelInfo="(required)"
            helperText="Description of your blog that will show up on the main page"
          >
            <TextArea
              name="description"
              value={this.state.description}
              onChange={this.onChange}
              fill
              style={{ resize: 'none' }}
              disabled={this.state.locked}
            />
          </FormGroup>
          <FormGroup
            htmlFor="mainSite"
            label="Website Link"
            labelInfo="(required)"
            helperText="Put a link to your primary site here"
          >
            <InputGroup
              name="mainSite"
              value={this.state.mainSite}
              onChange={this.onChange}
              disabled={this.state.locked}
            />
          </FormGroup>
          <FormGroup
            htmlFor="logo"
            label="Logo"
            labelInfo="(required)"
            helperText="For best results, please use SVG format"
          >
            {this.state.logoUri && (
              <div>
                <img
                  style={{
                    height: '15px',
                    marginTop: '5px',
                    marginBottom: '5px',
                  }}
                  src={this.state.logoUri}
                  alt="logo preview"
                />
                <br />
              </div>
            )}
            <FileInput
              text="Choose file..."
              onInputChange={this.handleFileUpload}
              disabled={this.state.locked}
            />
          </FormGroup>
          <div className="section-header">
            <h2>Tags</h2>
            <QuestionHint
              title="Tags"
              helperText="Tags are used to categorize your posts into different topics. The tags for each post will be displayed at the bottom of the page, and users can search articles by tag."
            />
          </div>
          {Object.keys(this.state.tags).map(key => {
            const { name, description } = this.state.tags[key]
            return (
              <React.Fragment>
                <Card>
                  <H5>{name}</H5>
                  <p>{description}</p>
                  <ButtonGroup style={{ marginLeft: 'auto' }}>
                    <Button
                      icon="edit"
                      onClick={() => this.openModalEdit(key)}
                      disabled={this.state.locked}
                    >
                      Edit
                    </Button>
                    <Button
                      icon="delete"
                      onClick={() => this.openAlert(key)}
                      disabled={this.state.locked}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </Card>
                <br />
              </React.Fragment>
            )
          })}
          <Button
            onClick={this.openModalNew}
            icon="add"
            disabled={this.state.locked}
          >
            New Tag
          </Button>
          <div className="section-header">
            <h2>Social Media Links</h2>
            <QuestionHint
              title="Social Media"
              helperText="Put in any links you have to your company's social media pages. They will be displayed on the home page to direct potential customers to explore your business more."
            />
          </div>

          <FormGroup htmlFor="twitterUrl" label="Twitter URL">
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
          <FormGroup htmlFor="facebookUrl" label="Facebook Page">
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
          <FormGroup htmlFor="linkedinUrl" label="LinkedIn Page">
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
        </div>
        <SideBarPreview
          tags={Object.values(this.state.tags)}
          logoUri={this.state.logoUri}
          description={this.state.description}
          twitterUrl={this.state.twitterUrl}
          facebookUrl={this.state.facebookUrl}
          linkedinUrl={this.state.linkedinUrl}
        />
        {/* Modals */}
        <TagModal
          isOpen={this.state.modalOpen}
          handleClose={this.handleClose}
          isEdit={this.state.modalIsEdit}
          modifyTag={this.modifyTag}
          modalTagName={this.state.modalTagName}
          modalTagDescription={this.state.modalTagDescription}
          modalTagKey={this.state.modalTagKey}
        />
        <Alert
          cancelButtonText="Cancel"
          confirmButtonText="Delete"
          icon="trash"
          intent={Intent.DANGER}
          isOpen={this.state.alertOpen}
          onCancel={this.handleAlertClose}
          onConfirm={this.handleMoveConfirm}
        >
          <p>
            Are you sure you want to delete this tag? It will be removed from
            all articles that are currently tagged
          </p>
        </Alert>
        <Alert
          cancelButtonText="Cancel"
          confirmButtonText="Discard Changes"
          icon="cross"
          intent={Intent.DANGER}
          isOpen={this.state.cancelChangesAlertOpen}
          onCancel={this.handleCancelCancelAlert}
          onConfirm={this.handleConfirmCancelAlert}
        >
          <p>
            Are you sure you want to cancel your changes? This action will
            delete all of the changes you have made.
          </p>
        </Alert>
        <Alert
          cancelButtonText="Cancel"
          confirmButtonText="Save Changes"
          icon="floppy-disk"
          intent={Intent.WARNING}
          isOpen={this.state.saveChangesAlertOpen}
          onCancel={this.handleCancelSaveAlert}
          onConfirm={this.handleConfirmSaveAlert}
        >
          <p>
            Are you sure you want to save your changes? This action will
            immediately push an update out to your blog with the new changes
            made.
          </p>
        </Alert>
      </div>
    )
  }
}

export default SiteInfo
