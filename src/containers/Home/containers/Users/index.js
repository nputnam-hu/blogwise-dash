import React, { Component } from 'react'
import {
  InputGroup,
  TextArea,
  FormGroup,
  Button,
  ButtonGroup,
  H5,
  Card,
  Text,
  FileInput,
} from '@blueprintjs/core'
import axios from 'axios'
import config from '../../../../config'
import { loadUser, saveUser } from './utils'
import './styles.sass'

class Users extends Component {
  state = {
    authors: {},
    locked: true,
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

  render() {
    return <div>Users</div>
  }
}

export default Users
