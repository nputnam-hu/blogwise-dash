import React, { Component } from 'react'
import {
  Button,
  Spinner,
  Card,
  Elevation,
  Intent,
  Popover,
  Position,
  Menu,
  MenuItem,
} from '@blueprintjs/core'
import moment from 'moment'
import Client from '../../../../client'
import './styles.sass'
import DeletePostModal from './DeletePostModal'

class MyPosts extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      blogPosts: [],
      dataLoading: true,
      deletePostModalOpen: false,
      deletePostId: '',
      dropDownsOpen: {},
    }
  }
  componentDidMount() {
    this.client.get('/blogs/posts').then(blogPosts => {
      this.setState({ blogPosts, dataLoading: false })
    })
  }
  openDeletePostModal = (e, deletePostId) => {
    if (!e) {
      // eslint-disable-next-line no-param-reassign
      e = window.event
    }
    e.cancelBubble = true
    if (e.stopPropagation) e.stopPropagation()

    this.setState({ deletePostModalOpen: true, deletePostId })
  }
  handleDeletePostModalClose = () =>
    this.setState({ deletePostModalOpen: false })
  deletePost = async () => {
    await this.client.delete(`/blogs/posts/${this.state.deletePostId}`)
    const newBlogPosts = this.state.blogPosts.filter(
      p => p.id !== this.state.deletePostId,
    )
    this.setState({
      blogPosts: newBlogPosts,
      deletePostModalOpen: false,
      deletePostId: '',
    })
  }
  closeDropDown = id => {
    const newDropDownOpens = { ...this.state.dropDownsOpens }
    newDropDownOpens[id] = false
    this.setState({ dropDownsOpen: newDropDownOpens })
  }

  render() {
    return (
      <>
        <div className="myposts">
          <div className="myposts__header">
            <h1>My Blog Posts</h1>
            <Button
              large
              icon="add"
              className="header__button"
              intent={Intent.PRIMARY}
              onClick={() => this.props.history.push('/posts/new')}
            >
              New Blog Post
            </Button>
          </div>
          <div className="myposts__list">
            {this.state.dataLoading && <Spinner />}
            {this.state.blogPosts.length === 0 && (
              <div style={{ paddingTop: '70px', textAlign: 'center' }}>
                <h1>Looks Like you don't have any blog posts yet</h1>
                <p>Click the button above to get started</p>
              </div>
            )}
            {this.state.blogPosts.map(post => (
              <Card
                key={post.id}
                elevation={Elevation.ONE}
                interactive
                onClick={() => this.props.history.push(`/posts/${post.id}`)}
                className="list__card"
              >
                {!post.hasBeenPublished && (
                  <span className="card__drafttext">(DRAFT)</span>
                )}
                <h2>{post.title || 'Untitled Post'}</h2>
                {post.publishDate && (
                  <span className="card__infotext">
                    • {moment(post.publishDate).format('LL')}
                  </span>
                )}
                {post.description && (
                  <span className="card__infotext cutoff">
                    • <i>{post.description}</i>
                  </span>
                )}
                <div style={{ width: '5px' }} />
                <Popover
                  isOpen={this.state.dropDownsOpen[post.id] || false}
                  position={Position.BOTTOM}
                  className="card__settingsbutton"
                  onInteraction={(_, e) => {
                    if (!e) {
                      // eslint-disable-next-line no-param-reassign
                      e = window.event
                    }
                    e.cancelBubble = true
                    if (e.stopPropagation) {
                      e.stopPropagation()
                    }

                    this.setState({
                      dropDownsOpen: {
                        ...this.state.dropDownsOpen,
                        [post.id]: true,
                      },
                    })
                  }}
                  onClose={() => this.closeDropDown(post.id)}
                >
                  <Button icon="cog" rightIcon="caret-down" />
                  <Menu>
                    <MenuItem
                      text="Delete Post"
                      intent={Intent.DANGER}
                      onClick={e => {
                        this.closeDropDown(post.id)
                        this.openDeletePostModal(e, post.id)
                      }}
                    />
                  </Menu>
                </Popover>
              </Card>
            ))}
          </div>
        </div>
        {/* Modals */}
        <DeletePostModal
          isOpen={this.state.deletePostModalOpen}
          handleClose={this.handleDeletePostModalClose}
          cancelDelete={this.handleDeletePostModalClose}
          deletePost={this.deletePost}
        />
      </>
    )
  }
}

export default MyPosts
