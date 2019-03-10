import React from 'react'
import './styles.sass'

function getColorByBgColor(bgColor) {
  if (!bgColor) {
    return ''
  }
  return parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff'
}

const HeaderPreview = ({ title, headerPhotoUri, color, bgImgUri }) => (
  <div
    style={{ background: bgImgUri ? `url(${bgImgUri})` : color }}
    id="headercontainer"
  >
    <div style={{ background: bgImgUri ? '' : color }} id="headercontent">
      <img id="headerimg" alt="Your Logo Here" src={headerPhotoUri} />
      <br />
      <span style={{ color: getColorByBgColor(color) }} id="headertext">
        {title}
      </span>
    </div>
  </div>
)

export default HeaderPreview
