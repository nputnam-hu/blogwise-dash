import React, { Component } from 'react'
import { InputGroup, FormGroup, Button, Intent } from '@blueprintjs/core'
import GoTrue from 'gotrue-js'
import qs from 'qs'
import store from 'store'
import Client from '../../../client'
import errorMessage from '../../../errorMessage'

class WriterRegister extends Component {
  constructor(props) {
    super(props)
    this.client = new Client()
    const { id } = qs.parse(props.location.search.slice(1))
    if (!id) {
      return this.props.history.push('/login')
    }
    this.state = {
      password: '',
      passwordConfirm: '',
      id,
    }
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onClick = async () => {
    if (this.state.password !== this.state.passwordConfirm) {
      errorMessage('Passwords do not match')
    } else {
      try {
        const { token, type, netlifyUrl, email } = await this.client.put(
          '/users/invite',
          {
            password: this.state.password,
            id: this.state.id,
          },
        )
        store.set('user', { token })
        const auth = new GoTrue({
          APIUrl: `${netlifyUrl}/.netlify/identity`,
          setCookie: false,
        })
        auth.signup(email, this.state.password)
        if (type === 'ADMIN') {
          this.props.history.push('/dashboard')
        } else {
          this.props.history.push('/writer/onboarding/1')
        }
      } catch (err) {
        errorMessage(
          'Error creating account, if this problem persists contact support',
        )
      }
    }
  }
  onKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      this.onClick()
    }
  }
  render() {
    return (
      <div className="onboarding-container">
        <div className="onboarding-stepcounter">Step 1 of 2</div>
        <h2>Welcome To Blogwise</h2>
        <span className="onboarding-subheader">
          Follow the steps to complete the registration of your blogwise account
        </span>
        <div className="onboarding-form login">
          <FormGroup htmlFor="password" label="Choose a Password">
            <InputGroup
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.onChange}
              placeholder="**********"
            />
          </FormGroup>
          <FormGroup htmlFor="passwordConfirm" label="Confirm Password">
            <InputGroup
              name="passwordConfirm"
              type="password"
              value={this.state.passwordConfirm}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              placeholder="**********"
            />
          </FormGroup>
          <br />
          <Button
            large
            rightIcon="arrow-right"
            onClick={this.onClick}
            intent={Intent.PRIMARY}
          >
            Create Account
          </Button>
        </div>
      </div>
    )
  }
}

export default WriterRegister
