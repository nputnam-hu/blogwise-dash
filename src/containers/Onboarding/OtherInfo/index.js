import React, { Component } from 'react'
import {
  FormGroup,
  InputGroup,
  TextArea,
  Button,
  Intent,
  ControlGroup,
} from '@blueprintjs/core'
import SideBarPreview from '../../Dashboard/containers/SiteInfo/previews/SideBar'
import './styles.sass'

class OtherInfo extends Component {
  state = {
    description: '',
    mainSite: '',
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onClick = () => {
    this.props.history.push('/dashboard', {
      ...this.state,
      ...this.props.location.state,
    })
  }
  render() {
    const enteredValues = Object.values(this.state).reduce(
      (acc, key) => acc || key,
    )
    return (
      <div id="otherinfo-container">
        <div
          className="onboarding-container otherinfo"
          style={
            enteredValues
              ? {
                  margin: '10px 10% 0px',
                }
              : {}
          }
        >
          <div className="onboarding-stepcounter">Step 5 of 5</div>
          <h2>Tell Your Story</h2>
          <span className="onboarding-subheader">
            Fill in a description of what your blog is about, as well as any
            external links you want to direct readers to.
          </span>
          <div className="onboarding-form">
            <FormGroup htmlFor="description" label="Description">
              <TextArea
                name="description"
                value={this.state.description}
                onChange={this.onChange}
                fill
                style={{ resize: 'none' }}
                disabled={this.state.locked}
              />
            </FormGroup>
            <FormGroup
              htmlFor="mainSite"
              label="Website Link"
              helperText="A link to your primary website"
            >
              <InputGroup
                name="mainSite"
                value={this.state.mainSite}
                onChange={this.onChange}
                disabled={this.state.locked}
              />
            </FormGroup>
            <FormGroup
              htmlFor="twitterUrl"
              label="Twitter URL"
              helperText="A link to your company's twitter account"
            >
              <ControlGroup>
                <span className="urlStart">www.twitter.com/</span>
                <InputGroup
                  name="twitterUrl"
                  style={{ paddingLeft: 2 }}
                  value={this.state.twitterUrl}
                  onChange={this.onChange}
                  disabled={this.state.locked}
                />
              </ControlGroup>
            </FormGroup>
            <FormGroup
              htmlFor="facebookUrl"
              label="Facebook URL"
              helperText="A link to your company's facebook page"
            >
              <ControlGroup>
                <span className="urlStart">www.facebook.com/</span>
                <InputGroup
                  name="facebookUrl"
                  style={{ paddingLeft: 2 }}
                  value={this.state.facebookUrl}
                  onChange={this.onChange}
                  disabled={this.state.locked}
                />
              </ControlGroup>
            </FormGroup>
            <FormGroup
              htmlFor="linkedinUrl"
              label="LinkedIn URL"
              helperText="A link to your company's LinkedIn Profile"
            >
              <ControlGroup>
                <span className="urlStart">www.linkedin.com/</span>
                <InputGroup
                  name="linkedinUrl"
                  style={{ paddingLeft: 2 }}
                  value={this.state.linkedinUrl}
                  onChange={this.onChange}
                  disabled={this.state.locked}
                />
              </ControlGroup>
            </FormGroup>
            <br />
            <Button
              large
              rightIcon="arrow-right"
              intent={Intent.SUCCESS}
              onClick={this.onClick}
            >
              Complete
            </Button>
          </div>
          {enteredValues && (
            <SideBarPreview
              tags={Object.values(this.props.location.state.tags)}
              logoUri={this.props.location.state.headerPhotoUri}
              description={this.state.description}
              twitterUrl={this.state.twitterUrl}
              facebookUrl={this.state.facebookUrl}
              linkedinUrl={this.state.linkedinUrl}
            />
          )}
        </div>
      </div>
    )
  }
}

export default OtherInfo
