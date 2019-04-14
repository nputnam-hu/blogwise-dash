import React from 'react'
import QuestionHint from '../QuestionHint'
import './styles.sass'

const HeaderPreview = ({
  title,
  headerPhotoUri,
  color,
  bgImgUri,
  headerTextColor,
}) => (
  <div className="headerpreview">
    <div className="section-header">
      <h2>Preview</h2>
      <QuestionHint
        title="Homepage Preview"
        helperText="This page lets your preview changes to the header of your homepage. The preview below is what the top of the homepage of your blog will look like."
      />
    </div>
    <div
      style={{ background: bgImgUri ? `url(${bgImgUri})` : color }}
      id="headercontainer"
    >
      <div style={{ background: bgImgUri ? '' : color }} id="headercontent">
        <img id="headerimg" alt="Your Logo Here" src={headerPhotoUri} />
        <br />
        <span style={{ color: headerTextColor }} id="headertext">
          <i>{title}</i>
        </span>
      </div>
    </div>
  </div>
)

export default HeaderPreview
