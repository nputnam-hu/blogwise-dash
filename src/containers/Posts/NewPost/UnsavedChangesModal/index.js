import React from 'react'
import { Alert, Intent } from '@blueprintjs/core'

const UnsavedChangesModal = ({
  isOpen,
  handleClose,
  saveAsDraft,
  discardChanges,
}) => (
  <Alert
    isOpen={isOpen}
    icon="warning-sign"
    intent={Intent.WARNING}
    onClose={handleClose}
    onCancel={saveAsDraft}
    onConfirm={discardChanges}
    cancelButtonText="Save Changes"
    confirmButtonText="Discard Changes"
  >
    <p>
      You have unsaved changes. Do you want to discard these changes or save as
      a draft?
    </p>
  </Alert>
)

export default UnsavedChangesModal
