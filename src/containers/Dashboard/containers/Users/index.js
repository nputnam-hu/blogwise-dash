import React, { Component } from 'react'
import { Button, Text, Intent, Icon, Alert, HTMLTable } from '@blueprintjs/core'
import axios from 'axios'
import config from '../../../../config'
import { loadUser, saveUser } from './utils'
import './styles.sass'

class Users extends Component {
  state = {
    authors: {},
    locked: true,
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

  render() {
    return (
      <div id="users-container">
        <div id="inputcontent">
          <h1>Users & Roles</h1>
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
          <h2>Users</h2>
        </div>
        {/* Modals */}
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

export default Users
