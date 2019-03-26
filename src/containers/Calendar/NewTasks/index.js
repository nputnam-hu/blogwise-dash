import React, { Component } from 'react'
import {
  FormGroup,
  InputGroup,
  Button,
  ProgressBar,
  Intent,
  Spinner,
} from '@blueprintjs/core'
import Select from 'react-select'
import Client from '../../../client'
import './styles.sass'
import errorMessage from '../../../toaster'

class NewTasks extends Component {
  constructor(props) {
    super(props)
    this.client = new Client()
    const { postCount } = props.location.state || {}
    this.state = {
      posts: [],
      currentIndex: 0,
      currentTitle: '',
      currentTags: [],
      tagNames: [],
      shouldFlip: false,
      dataLoading: true,
      postCount,
    }
  }
  componentDidMount() {
    if (!this.props.location.state) {
      this.props.history.push('/calendar/new')
    }
    this.client.get('/blogs').then(blog => {
      const tagNames = Object.keys(blog.tags).map(key => ({
        value: key,
        label: blog.tags[key].name,
      }))
      this.setState({ tagNames, dataLoading: false })
    })
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onClick = async () => {
    if (!this.state.posts[0] && !this.setState.posts[0].title) {
      errorMessage('Must schedule at least one post')
      return
    }
    try {
      const nonemptyPosts = this.state.posts.filter(p => p.title)
      await this.client.post('/calendars/posts', { posts: nonemptyPosts })
      this.props.history.push('/calendar')
    } catch (err) {
      let msg
      switch (err.error.code) {
        default:
          msg = 'There was a problem creating your calendar'
      }
      errorMessage(msg)
    }
  }
  onKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      this.savePost()
    }
  }
  savePost = () => {
    if (!this.state.currentTitle) {
      errorMessage('Must provide a headline')
      return
    }
    this.setState({
      shouldFlip: !this.state.shouldFlip,
      currentTitle: '',
      currentTags: [],
      currentIndex: this.state.currentIndex + 1,
      posts: [
        ...this.state.posts,
        { title: this.state.currentTitle, tags: this.state.currentTags },
      ],
    })
  }
  goBackOnePost = () => {
    const { posts, currentIndex } = this.state
    if (posts.length === 0) {
      return
    }
    const prevPost = posts[currentIndex - 1]
    const newPosts = [...posts]
    newPosts.splice(currentIndex - 1, 1)

    this.setState({
      currentIndex: currentIndex - 1,
      currentTitle: prevPost.title,
      currentTags: prevPost.tags,
      posts: newPosts,
      shouldFlip: !this.state.shouldFlip,
    })
  }
  skipToEnd = () => {
    if (this.state.currentIndex === 0) {
      errorMessage('Must provide at least one post to schedule')
      return
    }
    this.setState({
      postCount: this.state.posts.length,
      shouldFlip: !this.state.shouldFlip,
    })
  }
  render() {
    const enteredPosts = Math.min(this.state.posts.length, this.state.postCount)
    return (
      <div id="newtasks-container">
        <div className="onboarding-container newtasks">
          <Button
            small
            icon="arrow-left"
            className="onboarding-backbutton"
            minimal
            onClick={() => this.props.history.push('/calendar/new')}
          >
            Back
          </Button>
          <h2>Brainstorm New Posts</h2>
          <div style={{ height: '15px' }} />
          {this.state.dataLoading ? (
            <Spinner />
          ) : (
            <>
              <div
                className={`postinput-container${
                  this.state.shouldFlip ? ' flip' : ''
                }${
                  this.state.posts.length >= this.state.postCount ? ' done' : ''
                }`}
              >
                {this.state.posts.length < this.state.postCount ? (
                  <>
                    <FormGroup htmlFor="title" label="Headline">
                      <InputGroup
                        name="currentTitle"
                        placeholder="Your headline here"
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown}
                        value={this.state.currentTitle}
                        className="tagtextinput"
                      />
                    </FormGroup>
                    <div style={{ width: '40px' }} />
                    <FormGroup
                      htmlFor="currentTags"
                      label="Tags"
                      labelInfo="(optional)"
                    >
                      <Select
                        isMulti
                        name="currentTags"
                        options={this.state.tagNames}
                        value={this.state.currentTags}
                        onChange={currentTags => this.setState({ currentTags })}
                        className="tagmultiselect"
                      />
                    </FormGroup>
                    <div style={{ height: '40px', marginBottom: '-20px' }} />
                    <Button onClick={this.savePost}>Save Post</Button>
                    <div className="postinput-controlbuttons">
                      <Button
                        small
                        className="onboarding-backbutton"
                        minimal
                        onClick={this.goBackOnePost}
                      >
                        Previous Post
                      </Button>
                      <Button
                        small
                        className="onboarding-backbutton"
                        minimal
                        onClick={this.skipToEnd}
                      >
                        Skip to the end
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    intent={Intent.PRIMARY}
                    onClick={this.onClick}
                    rightIcon="arrow-right"
                    large
                  >
                    Create Campaign
                  </Button>
                )}
              </div>
              <div style={{ height: '40px' }} />
              <ProgressBar
                stripes={false}
                animate={false}
                intent={Intent.PRIMARY}
                value={enteredPosts / this.state.postCount}
                className="newtasks-progressbar"
              />
              <span className="onboarding-subheader">
                {enteredPosts}/{this.state.postCount} Posts
              </span>
            </>
          )}
        </div>
      </div>
    )
  }
}

export default NewTasks
