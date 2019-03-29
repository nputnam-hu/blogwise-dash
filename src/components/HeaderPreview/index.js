import React from 'react'
import QuestionHint from '../QuestionHint'
import './styles.sass'

function getColorByBgColor(bgColor) {
  if (!bgColor) {
    return ''
  }
  return parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff'
}

const HeaderPreview = ({ title, headerPhotoUri, color, bgImgUri }) => (
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
        <span style={{ color: getColorByBgColor(color) }} id="headertext">
          <i>{title}</i>
        </span>
      </div>
    </div>
  </div>
)

export default HeaderPreview
