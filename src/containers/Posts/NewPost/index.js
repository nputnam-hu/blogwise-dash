import React, { Component } from 'react'
import moment from 'moment'
import {
  InputGroup,
  FormGroup,
  TextArea,
  Button,
  Spinner,
} from '@blueprintjs/core'
import { DateInput } from '@blueprintjs/datetime'
import Select from 'react-select'
import ReactQuill from 'react-quill'
import CropImgUploader from '../../../components/CropImgUploader'
import PostNavbar from './PostNavbar'
import BlogPostPreview from './BlogPostPreview'
import NewDraftModal from './NewDraftModal'
import UnsavedChangesModal from './UnsavedChangesModal'
import SchedulePostModal from './SchedulePostModal'
import Client from '../../../client'
import errorMessage, { validateState, alertUser } from '../../../toaster'
import './styles.sass'

class NewPost extends Component {
  constructor(props) {
    super(props)
    this.client = new Client()
    if (!props.match.params.id) {
      return props.history.push('/dashboard/myposts')
    }
    this.state = {
      title: '',
      coverPhotoUri: '',
      thumbnailUri: '',
      description: '',
      htmlBody: '',
      tags: [],
      author: '',
      publishDate: null,
      scheduledPublishDate: null,
      hasBeenPublished: false,
      authorOptions: [],
      users: [],
      tagOptions: [],
      postModified: false,
      dataLoading: true,
      savingPost: false,
      postLastSaved: null,
      postIsNew: props.match.params.id === 'new',
      coverCropModalOpen: false,
      thumbCropModalOpen: false,
      newDraftModalOpen: false,
      unsavedChangesModalOpen: false,
      schedulePostModalOpen: false,
      // let links pass in default state params
      ...(props.location.state || {}),
    }
  }
  componentDidMount() {
    const loadData = async () => {
      const users = await this.client.get('/organizations/users')
      this.setState({
        authorOptions: users.map(u => ({ label: u.name, value: u.id })),
        users,
      })
      const blog = await this.client.get('/blogs')
      this.setState({
        tagOptions: Object.keys(blog.tags).map(key => ({
          value: key,
          label: blog.tags[key].name,
        })),
      })
      const { id } = this.props.match.params
      if (id === 'new') {
        await this.setState({ dataLoading: false })
      } else {
        const blogPost = await this.client.get(`/blogs/posts/${id}`)
        this.setState({
          title: blogPost.title || '',
          coverPhotoUri: blogPost.coverPhotoUri || '',
          thumbnailUri: blogPost.thumbnailUri || '',
          publishDate: blogPost.publishDate
            ? moment(blogPost.publishDate)
            : null,
          scheduledPublishDate: blogPost.scheduledPublishDate
            ? moment(blogPost.scheduledPublishDate)
            : null,
          description: blogPost.description || '',
          htmlBody: blogPost.htmlBody || '',
          hasBeenPublished: blogPost.hasBeenPublished,
          tags: blogPost.tags || [],
          author: blogPost.author || '',
          dataLoading: false,
        })
      }
    }
    loadData()
    // Auto save post every minute
    this.autoSavePost = setInterval(this.autoSave, 60 * 1000)
    window.addEventListener('beforeunload', this.onUnload)
  }
  componentWillUnmount() {
    clearInterval(this.autoSavePost)
    window.removeEventListener('beforeunload', this.onUnload)
  }
  // eslint-disable-next-line consistent-return
  onUnload = e => {
    if (this.state.postModified) {
      const confirmMessage =
        'Are you sure you want to leave the page? All unsaved changes will be lost'
      e.returnValue = confirmMessage
      return confirmMessage
    }
  }

  onChange = e =>
    this.setState({ [e.target.name]: e.target.value, postModified: true })

  openCoverCropModal = () => this.setState({ coverCropModalOpen: true })
  handleCoverCropModalClose = () => this.setState({ coverCropModalOpen: false })
  openThumbCropModal = () => this.setState({ thumbCropModalOpen: true })
  handleThumbCropModalClose = () => this.setState({ thumbCropModalOpen: false })
  openNewDraftModal = () => this.setState({ newDraftModalOpen: true })
  handleNewDraftModalClose = () => this.setState({ newDraftModalOpen: false })
  openUnsavedChangesModal = () =>
    this.setState({ unsavedChangesModalOpen: true })
  handleUnsavedChangesModalClose = () =>
    this.setState({ unsavedChangesModalOpen: false })
  openSchedulePostModal = () => this.setState({ schedulePostModalOpen: true })
  handleSchedulePostModalClose = () =>
    this.setState({ schedulePostModalOpen: false })

  backtoDash = () => {
    if (this.state.postIsNew) {
      this.openNewDraftModal()
    } else if (this.state.postModified) {
      this.openUnsavedChangesModal()
    } else {
      this.props.history.push('/dashboard/myposts')
    }
  }
  autoSave = () => {
    if (this.state.postModified && !this.state.hasBeenPublished) {
      this.saveDraft()
    }
  }
  saveDraft = async () => {
    this.setState({ savingPost: true, postModified: false })
    const updateBody = {
      title: this.state.title,
      description: this.state.description,
      coverPhotoUri: this.state.coverPhotoUri,
      thumbnailUri: this.state.thumbnailUri,
      htmlBody: this.state.htmlBody,
      publishDate: this.state.publishDate,
      tags: this.state.tags,
      author: this.state.author.value,
    }
    const { id } = this.props.match.params
    try {
      // If we're saving a new post
      if (id === 'new') {
        const { id: newId } = await this.client.post('/blogs/posts', updateBody)
        this.props.history.push(`/posts/${newId}`)
      } else {
        await this.client.put('/blogs/posts', { ...updateBody, id })
      }
      this.setState({
        savingPost: false,
        postIsNew: false,
        postLastSaved: moment(),
      })
    } catch (err) {
      errorMessage('Failed to save blog post')
    }
  }
  publishNow = async () => {
    if (
      !validateState(
        [
          ['title', 'Title'],
          ['htmlBody', 'Body Text'],
          ['publishDate', 'Publish Date'],
          ['author', 'Author'],
        ],
        this.state,
      )
    ) {
      return
    }
    await this.saveDraft()
    await this.client.post(`/blogs/posts/${this.props.match.params.id}/publish`)
    this.setState({ hasBeenPublished: true })
    alertUser('Post Published!')
  }
  schedulePublish = () => {
    if (
      !validateState(
        [
          ['title', 'Title'],
          ['htmlBody', 'Body Text'],
          ['publishDate', 'Publish Date'],
          ['author', 'Author'],
        ],
        this.state,
      )
    ) {
      return
    }
    this.openSchedulePostModal()
  }
  schedulePostPublish = async scheduledPublishDate => {
    await this.saveDraft()
    await this.client.post(
      `/blogs/posts/${this.props.match.params.id}/publish/schedule`,
      {
        scheduledPublishDate,
      },
    )
    this.setState({
      scheduledPublishDate: moment(scheduledPublishDate),
      schedulePostModalOpen: false,
    })
  }
  cancelSchedulePublish = async () => {
    this.setState({ savingPost: true })
    await this.client.delete(
      `/blogs/posts/${this.props.match.params.id}/publish/schedule/cancel`,
    )
    this.setState({ scheduledPublishDate: null, savingPost: false })
  }
  unpublishPost = async () => {
    this.setState({ savingPost: true })
    await this.client.post(
      `/blogs/posts/${this.props.match.params.id}/unpublish`,
    )
    this.setState({ hasBeenPublished: false, savingPost: false })
    alertUser('Post Unpublished')
  }
  modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image'],
      ['clean'],
    ],
  }
  formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ]

  render() {
    if (!this.state) return <div />
    return (
      <>
        <PostNavbar
          hasBeenPublished={this.state.hasBeenPublished}
          backtoDash={this.backtoDash}
          savingPost={this.state.savingPost}
          postLastSaved={this.state.postLastSaved}
          saveDraft={async () => {
            await this.saveDraft()
            this.props.history.push('/dashboard/myposts')
          }}
          publishNow={this.publishNow}
          schedulePublish={this.schedulePublish}
          unpublishPost={this.unpublishPost}
          scheduledPublishDate={this.state.scheduledPublishDate}
          cancelSchedulePublish={this.cancelSchedulePublish}
        />
        <div className="newpost">
          {this.state.dataLoading ? (
            <Spinner className="newpost__spinner" />
          ) : (
            <div className="newpost__inputs">
              <FormGroup htmlFor="title" label="Title">
                <InputGroup
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                />
              </FormGroup>
              <FormGroup htmlFor="author" label="Author">
                <Select
                  name="author"
                  options={this.state.authorOptions}
                  value={this.state.author}
                  onChange={author =>
                    this.setState({ author, postModified: true })
                  }
                />
              </FormGroup>
              <FormGroup htmlFor="pubdate-picker" label="Publish Date">
                <DateInput
                  name="pubdate-picker"
                  value={
                    this.state.publishDate && this.state.publishDate.toDate()
                  }
                  maxDate={new Date()}
                  formatDate={date => moment(date).format('LL')}
                  parseDate={str => moment(str).toDate()}
                  onChange={publishDate =>
                    this.setState({
                      publishDate: moment(publishDate),
                      postModified: true,
                    })
                  }
                />
              </FormGroup>
              <FormGroup
                htmlFor="coverPhotoUri"
                label="Cover Photo"
                labelInfo="(optional)"
              >
                {this.state.coverPhotoUri && (
                  <>
                    <img
                      src={this.state.coverPhotoUri}
                      alt="Cover Preview"
                      className="inputscover__preview"
                    />
                    <br />
                  </>
                )}
                <Button
                  text={
                    this.state.coverPhotoUri ? 'Change File' : 'Choose file...'
                  }
                  name="coverPhotoUri"
                  onClick={this.openCoverCropModal}
                />
              </FormGroup>
              <FormGroup
                htmlFor="thumbnailUri"
                label="Thumbnail"
                labelInfo="(optional)"
                helperText="If no thumbnail is provided, will default to cover photo"
              >
                {this.state.coverPhotoUri && (
                  <>
                    <img
                      src={this.state.coverPhotoUri}
                      alt="Cover Preview"
                      className="inputscover__preview"
                    />
                    <br />
                  </>
                )}
                <Button
                  text={
                    this.state.thumbnailUri ? 'Change File' : 'Choose file...'
                  }
                  name="thumbnailUri"
                  onClick={this.openThumbCropModal}
                />
              </FormGroup>
              <FormGroup htmlFor="description" label="Description">
                <TextArea
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  fill
                  style={{ resize: 'none' }}
                />
              </FormGroup>
              <FormGroup htmlFor="body-text" label="Body Text">
                <ReactQuill
                  name="body-text"
                  theme="snow"
                  style={{ height: '500px' }}
                  value={this.state.htmlBody}
                  onChange={(htmlBody, _, source) =>
                    this.setState({ htmlBody, postModified: source === 'user' })
                  }
                  placeholder="Start telling your story..."
                  modules={this.modules}
                  format={this.formats}
                />
              </FormGroup>
              <div style={{ height: '40px' }} />
              <FormGroup htmlFor="tags" label="Tags">
                <Select
                  isMulti
                  name="currentTags"
                  options={this.state.tagOptions}
                  value={this.state.tags}
                  onChange={tags => this.setState({ tags, postModified: true })}
                  menuPlacement="top"
                />
              </FormGroup>
            </div>
          )}
          {!this.state.dataLoading && (
            <BlogPostPreview
              title={this.state.title}
              coverPhotoUri={this.state.coverPhotoUri}
              description={this.state.description}
              htmlBody={this.state.htmlBody}
              tags={this.state.tags.map(t => t.label)}
              publishDate={this.state.publishDate}
              author={
                this.state.users.filter(
                  u => u.id === this.state.author.value,
                )[0]
              }
            />
          )}
        </div>
        {/* Modals */}
        <CropImgUploader
          isOpen={this.state.coverCropModalOpen}
          handleClose={this.handleCoverCropModalClose}
          client={this.client}
          fileLabel="Cover Photo"
          onConfirmCrop={url =>
            this.setState({
              coverPhotoUri: url,
              coverCropModalOpen: false,
              postModified: true,
            })
          }
        />
        <CropImgUploader
          aspectRatio={153 / 133}
          isOpen={this.state.thumbCropModalOpen}
          handleClose={this.handleThumbCropModalClose}
          client={this.client}
          fileLabel="Thumbnail"
          onConfirmCrop={url =>
            this.setState({
              thumbnailUri: url,
              thumbCropModalOpen: false,
              postModified: true,
            })
          }
        />
        <NewDraftModal
          isOpen={this.state.newDraftModalOpen}
          handleClose={this.handleNewDraftModalClose}
          saveAsDraft={async () => {
            await this.saveDraft()
            this.setState({ newDraftModalOpen: false })
            this.props.history.push('/dashboard/myposts')
          }}
          deletePost={async () => {
            const { id } = this.props.match.params
            if (id !== 'new') {
              await this.client.delete(`/blogs/posts/${id}`)
            }
            this.props.history.push('/dashboard/myposts')
          }}
        />
        <UnsavedChangesModal
          isOpen={this.state.unsavedChangesModalOpen}
          handleClose={this.handleUnsavedChangesModalClose}
          saveAsDraft={async () => {
            await this.saveDraft()
            this.setState({ unsavedChangesModalOpen: false })
            this.props.history.push('/dashboard/myposts')
          }}
          discardChanges={() => {
            this.setState({ unsavedChangesModalOpen: false })
            this.props.history.push('/dashboard/myposts')
          }}
        />
        <SchedulePostModal
          isOpen={this.state.schedulePostModalOpen}
          handleClose={this.handleSchedulePostModalClose}
          schedulePostPublish={this.schedulePostPublish}
        />
      </>
    )
  }
}

export default NewPost
