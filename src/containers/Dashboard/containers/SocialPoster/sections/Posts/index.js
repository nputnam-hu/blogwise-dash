import React, { Component } from 'react'
import {
  // Icon,
  // Intent,
  // Dialog,
  // Button,
  // FormGroup,
  // InputGroup,
  // HTMLSelect,
  Spinner,
} from '@blueprintjs/core'
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

  //   openModal = () => this.setState({ modalIsOpen: true })
  //   handleModalClose = () =>
  //     this.setState({
  //       modalIsOpen: false,
  //       newName: '',
  //       newEmail: '',
  //       newRole: '',
  //     })

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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Bio</th>
                  <th>Invite Status</th>
                </tr>
              </thead>
              <tbody>
                <tr key={1} onClick={() => console.log('hi')}>
                  <td>name</td>
                  <td>email</td>
                  <td>post</td>
                  <td>bio</td>
                  <td>...</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    )
  }
}

export default Posts
