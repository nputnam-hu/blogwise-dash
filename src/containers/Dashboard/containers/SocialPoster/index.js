import React, { Component } from 'react'
import Client from '../../../../client'
import './styles.sass'
import BlueButton from '../../../../components/BlueButton'

class SocialPoster extends Component {
  constructor() {
    super()
    this.client = new Client()
  }
  render() {
    return (
      <div className="socialposter">
        <div className="myposts__header socialposter__header">
          <div className="section-header myblog">
            <h2>Social Poster</h2>
          </div>
          <BlueButton
            large
            className="header__button"
            onClick={() => this.props.history.push('/social/settings')}
          >
            Connect Social Accounts
          </BlueButton>
        </div>
        <div className="socialposter__table">
          <h2 />
        </div>
      </div>
    )
  }
}

export default SocialPoster
