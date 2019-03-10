import React, { Component } from 'react'
import {
  FormGroup,
  InputGroup,
  Button,
  ProgressBar,
  Intent,
} from '@blueprintjs/core'
import Select from 'react-select'
import Client from '../../../client'
import './styles.sass'

class NewTasks extends Component {
  constructor(props) {
    super(props)
    this.client = new Client()
    const { dateRange, postCount } = props.location.state || {}
    this.state = {
      posts: [{ title: '', tags: [] }],
      dateRange,
      postCount,
      tagNames: [],
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
      this.setState({ tagNames })
    })
  }
  onTagChange = (val, i) => {
    const newPosts = [...this.state.posts]
    newPosts[i].tags = val
    if (val.length === 0 && !newPosts[i].title) {
      newPosts.splice(i, 1)
    }
    this.setState({ posts: newPosts })
  }
  onTitleChange = (e, i) => {
    let newPosts = [...this.state.posts]
    if (i === this.state.posts.length - 1 && !this.state.posts[i].title) {
      newPosts = [...this.state.posts, { title: '', tags: [] }]
    }
    newPosts[i].title = e.target.value
    if (!e.target.value && newPosts[i].tags.length === 0) {
      newPosts.splice(i, 1)
    }
    this.setState({ posts: newPosts })
  }
  onClick = () => {}
  render() {
    const enteredPosts = Math.min(
      this.state.posts.length - 1,
      this.state.postCount,
    )
    return (
      <div id="newtasks-container">
        <div className="onboarding-container newtasks">
          <h2>Brainstorm Posts</h2>
          <div style={{ height: '15px' }} />
          {this.state.posts.map((post, i) => (
            <div className="postinput-container" key={post.name}>
              <FormGroup htmlFor="title" label="Title">
                <InputGroup
                  name="title"
                  placeholder="Your headline here"
                  onChange={e => this.onTitleChange(e, i)}
                  value={this.state.posts[i].title}
                  className="tagtextinput"
                />
              </FormGroup>
              <div style={{ width: '40px' }} />
              <FormGroup htmlFor="tags" label="Tags" labelInfo="(optional)">
                <Select
                  isMulti
                  name="tags"
                  options={this.state.tagNames}
                  value={this.state.posts[i].tags}
                  onChange={val => this.onTagChange(val, i)}
                  className="tagmultiselect"
                />
              </FormGroup>
            </div>
          ))}
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
          <div style={{ height: '50px' }} />
          <Button
            intent={Intent.PRIMARY}
            onClick={this.onClick}
            rightIcon="arrow-right"
            large
          >
            Create Campaign
          </Button>
        </div>
      </div>
    )
  }
}

export default NewTasks
