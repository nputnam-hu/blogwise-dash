import { Toaster, Position, Intent } from '@blueprintjs/core'

const toaster = Toaster.create()

export default function(message) {
  return toaster.show({
    message,
    position: Position.TOP,
    intent: Intent.DANGER,
    icon: 'cross',
  })
}
