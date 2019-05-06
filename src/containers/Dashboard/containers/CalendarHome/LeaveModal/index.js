import React from 'react'
import { Alert, Intent } from '@blueprintjs/core'

const UnsavedChangesModal = ({
  isOpen,
  handleClose,
  discardChanges,
  closeModal,
}) => (
  <Alert
    isOpen={isOpen}
    icon="warning-sign"
    intent={Intent.WARNING}
    onClose={closeModal}
    onCancel={handleClose}
    onConfirm={discardChanges}
    cancelButtonText="Save Changes"
    confirmButtonText="Discard Changes"
  >
    <p>
      You have unsaved changes. Do you want to discard these changes or save
      them?
    </p>
  </Alert>
)

export default UnsavedChangesModal
