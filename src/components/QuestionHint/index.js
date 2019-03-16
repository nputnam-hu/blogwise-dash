import React from 'react'
import { Icon, Popover, PopoverInteractionKind, H5 } from '@blueprintjs/core'

import './styles.sass'

const QuestionHint = ({ title, helperText, ...rest }) => (
  <Popover interactionKind={PopoverInteractionKind.HOVER}>
    <Icon icon="help" iconSize={15} {...rest} />
    <div id="popover-container">
      <H5>{title}</H5>
      <p>{helperText}</p>
    </div>
  </Popover>
)

export default QuestionHint
