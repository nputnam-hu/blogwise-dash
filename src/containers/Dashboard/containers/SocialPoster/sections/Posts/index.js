import React, { Component } from 'react'
import { Spinner } from '@blueprintjs/core'
import BlueButton from '../../../../../../components/BlueButton'
import Client from '../../../../../../client'
import './styles.sass'

class Posts extends Component {
  constructor(props) {
    super(props)
    this.client = new Client()
    this.state = {
      blogPosts: [],
      dataLoading: true,
    }
  }
  componentDidMount() {
    this.client.get('/blogs/posts').then(blogPosts => {
      this.setState({ blogPosts, dataLoading: false })
    })
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onSelectChange = e => this.setState({ newRole: e.currentTarget.value })

  handleClick = post => { 
    console.log(window.location)
    this.props.updateFunc({
      isOpen: true,
      text: post.title + ': ' + post.description,
      link: window.location.origin + post.slug
    })
  }

  render() {
    const { blogPosts } = this.state
    return (
      <div id="posts-container">
        <div id="content-wrapper">
          {this.state.dataLoading ? (
            <Spinner />
          ) : (
            <table className="bp3-html-table bp3-html-table-striped bp3-interactive posts-table">
              <thead>
                <tr>
                  <th>Published Date</th>
                  <th>Title</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {blogPosts.map(post => {
                  const { id, description, publishDate, title } = post
                  return (
                    <tr key={id}>
                      <td>{publishDate}</td>
                      <td>{title}</td>
                      <td>{description.substring(0, 40)}</td>
                      <td>
                        <BlueButton onClick={() => this.handleClick(post)}>
                          Share!
                        </BlueButton>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    )
  }
}

export default Posts
