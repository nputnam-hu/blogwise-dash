import React, { Component } from 'react'
import {
  Button,
  Intent,
  FormGroup,
  InputGroup,
  RadioGroup,
  Radio,
} from '@blueprintjs/core'
import store from 'store'
import Client from '../../../client'
import errorMessage from '../../../errorMessage'
import lowerSwoosh from './lower_swoosh.png'
import upperSwoosh from './upper_swoosh.png'
import girlPainting from './girl_painting.png'
import './styles.sass'

class Register extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      name: '',
      email: '',
      password: '',
      surveyAnswer: '',
    }
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onRadioChange = e => this.setState({ surveyAnswer: e.target.value })
  onClick = async () => {
    if (!this.state.name || !this.state.email) {
      return
    }
    try {
      const user = await this.client.post('/organizations', {
        surveyAnswer: this.state.surveyAnswer,
        user: {
          name: this.state.name,
          email: this.state.email,
          hash: this.state.password,
        },
      })
      store.set('user', user)
      if (!this.props.location.state || !this.props.location.state.plan) {
        this.props.history.push('/plans', {
          surveyAnswer: this.state.surveyAnswer,
          name: this.state.name,
          email: this.state.email,
        })
      } else {
        this.props.history.push('/onboarding/1', {
          surveyAnswer: this.state.surveyAnswer,
          name: this.state.name,
          email: this.state.email,
        })
      }
    } catch (err) {
      errorMessage('An account with that email already exists')
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
      <div id="register-container">
        <img src={upperSwoosh} alt="Upper Swoosh" id="upperswoosh-img" />
        <img src={girlPainting} alt="Woman Painting" id="girlpainting-img" />
        <div className="onboarding-container register">
          <div className="onboarding-stepcounter">Step 1 of 4</div>
          <h2>Let's Create Something Special</h2>
          <span className="onboarding-subheader">
            Get a world-class blog up in just minutes.
          </span>
          <div className="onboarding-form">
            <FormGroup htmlFor="name" label="Your Name" labelInfo="(required)">
              <InputGroup
                name="name"
                value={this.state.name}
                onChange={this.onChange}
                placeholder="Steve Jobs"
              />
            </FormGroup>
            <FormGroup
              htmlFor="email"
              label="Your Email"
              labelInfo="(required)"
            >
              <InputGroup
                name="email"
                value={this.state.email}
                onChange={this.onChange}
                placeholder="steve@apple.com"
              />
            </FormGroup>
            <FormGroup
              htmlFor="password"
              label="Choose a Password"
              labelInfo="(required)"
            >
              <InputGroup
                name="password"
                type="password"
                value={this.state.password}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                placeholder="**********"
              />
            </FormGroup>
            <RadioGroup
              name="surveryAnswer"
              label="What is the main goal you have for your blog?"
              onChange={this.onRadioChange}
              selectedValue={this.state.surveyAnswer}
            >
              <Radio label="Reaching new customers" value="marketing" />
              <Radio label="Engaging existing customers" value="engaging" />
              <Radio
                label="Recruiting talented employeees"
                value="recruiting"
              />
              <Radio label="Other" value="other" />
            </RadioGroup>
            <br />
            <Button
              large
              rightIcon="arrow-right"
              intent={Intent.PRIMARY}
              onClick={this.onClick}
            >
              Create your blog
            </Button>
            <button
              onClick={() => {
                this.props.history.push('/login')
              }}
              className="onboarding-setuplater"
            >
              Or Log In to an Existing Account
            </button>
          </div>
        </div>
        <img src={lowerSwoosh} alt="Lower Swoosh" id="lowerswoosh-img" />
      </div>
    )
  }
}

export default Register
