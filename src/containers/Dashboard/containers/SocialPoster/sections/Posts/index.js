import React, { Component } from 'react'
import { Spinner, InputGroup } from '@blueprintjs/core'
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
      query: '',
      filtered: [],
    }
  }
  componentDidMount() {
    this.client.get('/blogs/posts').then(blogPosts => {
      this.setState({ blogPosts, dataLoading: false, filtered: blogPosts })
    })
  }
  
  onSearchChange = e => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      let currentList = []
      let newList = []
      if (this.state.query !== '') {
        currentList = this.state.blogPosts
        newList = currentList.filter(item => {
          const filter = this.state.query.toLowerCase()
          const title = item.title.toLowerCase()
          const descript = item.description.toLowerCase()
          return title.includes(filter) || descript.includes(filter)
        })
      } else {
        newList = this.state.blogPosts
      }
      this.setState({ filtered: newList })
    })
  }

  handleClick = post => {
    this.props.updateFunc({
      isOpen: true,
      text: post.title + ': ' + post.description,
      link: `https://blog.blogwise.co/${post.slug}`,
    })
  }

  render() {
    const { query, filtered } = this.state
    return (
      <div id="posts-container">
        <div id="content-wrapper">
          {this.state.dataLoading ? (
            <Spinner />
          ) : (
            <div>
              <InputGroup
                name="query"
                placeholder="Search..."
                value={query}
                onChange={this.onSearchChange}
              />
              <table className="bp3-html-table bp3-html-table-striped bp3-interactive posts-table">
                <thead>
                  <tr>
                    <th>Published Date</th>
                    <th>Title</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(post => {
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
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default Posts
