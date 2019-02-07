import React, { Component } from 'react'
import {
  Button,
  Intent,
  Dialog,
  FormGroup,
  InputGroup,
  HTMLSelect,
} from '@blueprintjs/core'
import './styles.sass'

class Tags extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: {
        id1: {
          email: this.props.location.state.email,
          name: this.props.location.state.name,
          role: 'Admin',
          status: 'Accepted',
        },
      },
      newName: '',
      newEmail: '',
      newRole: 'Writer',
      modalIsOpen: false,
    }
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onSelectChange = e => this.setState({ newRole: e.currentTarget.value })
  onClick = () => {
    this.props.history.push('/onboarding/4', {
      ...this.props.location.state,
      users: this.state.users,
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
  inviteNewUser = () => {
    const { newName, newRole, newEmail, users } = this.state
    if (!newName || !newEmail) {
      return
    }
    this.setState({
      modalIsOpen: false,
      newName: '',
      newEmail: '',
      newRole: '',
      users: {
        ...users,
        [Date.now()]: {
          name: newName,
          email: newEmail,
          role: newRole,
          status: 'Pending',
        },
      },
    })
  }

  render() {
    const { users } = this.state
    return (
      <div className="onboarding-container">
        <div className="onboarding-stepcounter">Step 4 of 5</div>
        <h2>Invite Colloborators</h2>
        <span className="onboarding-subheader">
          Manage the different users that can contribute to your blog. We've set
          you up as the first admin; invite other colloborators by email.
        </span>
        <div className="onboarding-form users">
          <table className="bp3-html-table bp3-html-table-striped bp3-interactive">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(users).map(({ name, email, role, status }) => (
                <tr>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>{role}</td>
                  <td>{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            style={{
              alignSelf: 'flex-start',
            }}
            icon="new-person"
            onClick={this.openModal}
          >
            Invite User
          </Button>
          <Button
            large
            rightIcon="arrow-right"
            intent={Intent.PRIMARY}
            onClick={this.onClick}
          >
            Next Step
          </Button>
          <button onClick={this.onClick} className="onboarding-setuplater">
            I'll set this up later
          </button>
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
                  options={[{ value: 'Writer' }, { value: 'Admin' }]}
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
      </div>
    )
  }
}

export default Tags
