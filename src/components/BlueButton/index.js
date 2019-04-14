import React from 'react'
import bookmark from './icons/bookmark.svg'
import checkmark from './icons/checkmark.svg'
import upload from './icons/upload.svg'
import gear from './icons/gear.svg'
import pencil from './icons/pencil.svg'
import plus from './icons/plus.svg'
import inviteUser from './icons/invite-user.svg'
import './styles.sass'

const genIcon = icon => {
  if (!icon) {
    return null
  }
  switch (icon) {
    case 'gear':
      return {
        src: gear,
        alt: 'Settings',
      }
    case 'bookmark':
      return {
        src: bookmark,
        alt: 'Bookmark',
      }
    case 'checkmark':
      return {
        src: checkmark,
        alt: 'Checkmark',
      }
    case 'upload':
      return {
        src: upload,
        alt: 'File Upload',
      }
    case 'pencil':
      return {
        src: pencil,
        alt: 'Edit',
      }
    case 'plus':
      return {
        src: plus,
        alt: 'Add',
      }
    case 'inviteUser':
      return {
        src: inviteUser,
        alt: 'Invite User',
      }
    default:
      console.warn('Invalid icon prop given, ignored')
      return null
  }
}

const BlueButton = ({ icon, children, onClick }) => {
  const iconProps = genIcon(icon)
  return (
    <button className="bluebutton" onClick={onClick}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      {iconProps && <img {...iconProps} className="bluebutton__icon" />}
      {children}
    </button>
  )
}

export default BlueButton
