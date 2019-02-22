import React, { Component } from 'react'
import {
  FormGroup,
  InputGroup,
  Button,
  Intent,
  Spinner,
} from '@blueprintjs/core'
import Client from '../../../client'
import './styles.sass'

function getColorByBgColor(bgColor) {
  if (!bgColor) {
    return ''
  }
  return parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff'
}

const NavbarPreview = ({ backgroundHexCode, logoUri, customNavbarLinks }) => (
  <div id="navbar-preview" style={{ background: backgroundHexCode }}>
    <img id="navbar-logo" src={logoUri} alt="Kaldi" />
    <div id="navbar-links">
      {customNavbarLinks.map(({ link, name }) => (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={link}
          alt={name}
          style={{ color: getColorByBgColor(backgroundHexCode) }}
        >
          {name}
        </a>
      ))}
    </div>
  </div>
)

class BlogNavbar extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      backgroundHexCode: '',
      logoUri: '',
      customNavbarLinks: [{ name: '', link: '', order: 1 }],
      dataLoading: true,
      order: 1,
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.setState({
        backgroundHexCode: blog.backgroundHexCode,
        logoUri: blog.headerPhotoUri,
        customNavbarLinks: [
          ...(blog.customNavbarLinks || []),
          { name: '', link: '', order: 1 },
        ],
        dataLoading: false,
      })
    })
  }
  onLinkChange = (e, i) => {
    const navLinks = this.state.customNavbarLinks.sort(
      (a, b) => -b.order + a.order,
    )
    const newLinks = [...navLinks]
    newLinks[i][e.target.name] = e.target.value
    this.setState({
      customNavbarLinks: newLinks,
    })
  }
  onBackButtonClick = () => {
    this.props.history.push('/dashboard')
  }
  onClick = async () => {
    await this.client.put('/blogs', {
      customNavbarLinks: this.state.customNavbarLinks,
    })
    this.props.history.push('/dashboard')
  }
  addLink = () => {
    const navLinks = this.state.customNavbarLinks.sort(
      (a, b) => -b.order + a.order,
    )
    this.setState({
      customNavbarLinks: [
        ...navLinks,
        { name: '', link: '', order: this.state.order + 1 },
      ],
      order: this.state.order + 1,
    })
  }
  render() {
    const navLinks = this.state.customNavbarLinks.sort(
      (a, b) => -b.order + a.order,
    )
    return (
      <div id="blognavbar-container">
        {this.state.dataLoading ? (
          <Spinner />
        ) : (
          <NavbarPreview
            backgroundHexCode={this.state.backgroundHexCode}
            logoUri={this.state.logoUri}
            customNavbarLinks={this.state.customNavbarLinks}
          />
        )}
        <div className="onboarding-container">
          <Button
            small
            icon="arrow-left"
            className="onboarding-backbutton"
            minimal
            onClick={this.onBackButtonClick}
          >
            Back
          </Button>
          <h2>Customize Navbar</h2>
          <span className="onboarding-subheader">
            Put in custom navbar links to direct users to your main site
          </span>
          <br />
          <br />
          <div className="onboarding-form blognavbar">
            {navLinks.map((link, i) => (
              <div className="taginput-container" key={link.order}>
                <FormGroup htmlFor="name" label="Title">
                  <InputGroup
                    name="name"
                    placeholder="Our Product"
                    className="link-input"
                    onChange={e => this.onLinkChange(e, i)}
                    value={navLinks[i].name}
                  />
                </FormGroup>
                <FormGroup htmlFor="link" label="Link">
                  <InputGroup
                    name="link"
                    className="link-input"
                    placeholder="https://example.com/product"
                    onChange={e => this.onLinkChange(e, i)}
                    value={navLinks[i].link}
                  />
                </FormGroup>
              </div>
            ))}
            <Button
              style={{
                alignSelf: 'flex-start',
              }}
              icon="add"
              onClick={this.addLink}
            >
              Add Another Link
            </Button>
            <Button
              style={{ marginTop: '30px' }}
              large
              rightIcon="floppy-disk"
              intent={Intent.PRIMARY}
              onClick={this.onClick}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default BlogNavbar
