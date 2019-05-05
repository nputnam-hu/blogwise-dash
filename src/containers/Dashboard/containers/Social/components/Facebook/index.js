import React from 'react'
import SocialLogin from 'react-social-login'
import BlueButton from '../../../../../../components/BlueButton'

const FacebookButton = ({ children, triggerLogin, ...props }) => (
  <BlueButton icon="upload" onClick={triggerLogin} {...props}>
    {children}
  </BlueButton>
)

export default SocialLogin(FacebookButton)
