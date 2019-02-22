import React, { Component } from 'react'
import {
  Icon,
  Button,
  Intent,
  Dialog,
  FormGroup,
  InputGroup,
  HTMLSelect,
} from '@blueprintjs/core'
import EditModal from '../../../../../../components/EditModal'
import QuestionHint from '../../../../../../components/QuestionHint'
import errorMessage from '../../../../../../errorMessage'
import Client from '../../../../../../client'
import './styles.sass'

function trimString(str) {
  return str ? `${str.slice(0, 25)}...` : ''
}

class Users extends Component {
  constructor(props) {
    super(props)
    this.client = new Client()
    this.state = {
      users: [],
      newName: '',
      newEmail: '',
      newRole: 'WRITER',
      modalIsOpen: false,
      editModalIsOpen: false,
      editModalUser: {},
    }
  }
  componentDidMount() {
    this.client.get('/organizations/users').then(users => {
      this.setState({ users })
    })
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onSelectChange = e => this.setState({ newRole: e.currentTarget.value })
  onClick = () => {
    this.props.history.push('/onboarding/4', {
      ...this.props.location.state,
    })
  }

  openModal = () => this.setState({ modalIsOpen: true })
  handleModalClose = () =>
    this.setState({
      modalIsOpen: false,
      newName: '',
      newEmail: '',
      newRole: '',
    })
  inviteNewUser = async () => {
    const { newName, newRole, newEmail, users } = this.state
    if (!newName || !newEmail) {
      return
    }
    try {
      const { user } = await this.client.post('/users/invite', {
        name: newName,
        email: newEmail,
        type: newRole,
      })

      this.setState({
        modalIsOpen: false,
        newName: '',
        newEmail: '',
        newRole: '',
        users: [...users, user],
      })
    } catch (err) {
      switch (err.error.code) {
        case 1006:
          errorMessage('A user with that email already exists')
          break
        case 1008:
          errorMessage(
            'Your plan has reached the max number of staff users, please upgrade to invite more users',
          )
          break
        default:
          errorMessage(
            'There was a problem inviting that user, if the problem continues contact support',
          )
          break
      }
    }
  }

  editUser = user =>
    this.setState({ editModalIsOpen: true, editModalUser: user })
  handleEditModalClose = () =>
    this.setState({ editModalIsOpen: false, editModalUser: {} })
  handleUserEdit = user => {
    const newUsers = this.state.users.reduce((acc, el) => {
      if (el.id === user.id) {
        return [...acc, user]
      }
      return [...acc, el]
    }, [])
    this.setState({
      editModalIsOpen: false,
      editModalUser: {},
      users: newUsers,
    })
  }

  render() {
    const { users } = this.state
    return (
      <div id="users-container">
        <div id="inputcontent">
          <div className="section-header">
            <a href="#users-roles" name="users-roles">
              <h2>Users & Roles</h2>
            </a>
            <QuestionHint
              title="Users"
              helperText="New users can be assigned one of two roles: Admin and Writer. Writers can write new content for the blog and publish new posts. Admins, in addition to having the same writing power as Writers, can also manage the blog content and settings on the blogwise dashboard."
            />
          </div>
          <table className="bp3-html-table bp3-html-table-striped bp3-interactive users-table">
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
              {users.map(user => {
                const { name, email, type, token, id, bio } = user
                return (
                  <tr key={id} onClick={() => this.editUser(user)}>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{type === 'ADMIN' ? 'Admin' : 'Writer'}</td>
                    <td>{trimString(bio)}</td>
                    <td>{token ? 'Accepted' : 'Pending'}</td>
                    <td>
                      <Icon icon="edit" />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <Button
            style={{
              alignSelf: 'flex-start',
            }}
            large
            icon="new-person"
            onClick={this.openModal}
          >
            Invite User
          </Button>
        </div>
        {/* Modals */}
        <Dialog
          icon="new-person"
          isOpen={this.state.modalIsOpen}
          onClose={this.handleModalClose}
          title="Invite User"
        >
          <div style={{ padding: '5px 5% 5px' }}>
            <span style={{ color: '#86969F' }}>
              Enter in the information of who you want to invite. We'll send
              them an email with a link to create an account
            </span>
            <div style={{ padding: '15px 10% 0px' }}>
              <FormGroup htmlFor="newName" label="Name">
                <InputGroup
                  name="newName"
                  placeholder="Steve Jobs"
                  value={this.state.newNname}
                  onChange={this.onChange}
                />
              </FormGroup>
              <FormGroup htmlFor="newEmail" label="Email">
                <InputGroup
                  name="newEmail"
                  placeholder="steve@apple.com"
                  value={this.state.newEmail}
                  onChange={this.onChange}
                />
              </FormGroup>
              <FormGroup htmlFor="newRole" label="Role">
                <HTMLSelect
                  onChange={this.onSelectChange}
                  options={[
                    { label: 'Writer', value: 'WRITER' },
                    { label: 'Admin', value: 'ADMIN' },
                  ]}
                />
              </FormGroup>
              <br />
              <Button
                large
                intent={Intent.PRIMARY}
                onClick={this.inviteNewUser}
                rightIcon="envelope"
              >
                Invite
              </Button>
            </div>
          </div>
        </Dialog>
        <EditModal
          isOpen={this.state.editModalIsOpen}
          handleClose={this.handleEditModalClose}
          user={this.state.editModalUser}
          handleSave={this.handleUserEdit}
        />
      </div>
    )
  }
}

export default Users
