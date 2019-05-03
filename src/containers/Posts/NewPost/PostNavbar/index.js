import React from 'react'
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  Position,
  Intent,
  Icon,
  Spinner,
} from '@blueprintjs/core'
import './styles.sass'
import logo from './logo.png'
import BlueButton from '../../../../components/BlueButton'
import ExpandMore from './expandMore'

const PostNavbar = ({
  hasBeenPublished,
  backtoDash,
  savingPost,
  postLastSaved,
  saveDraft,
  publishNow,
  schedulePublish,
  unpublishPost,
  scheduledPublishDate,
  cancelSchedulePublish,
}) => {
  let title
  if (scheduledPublishDate) {
    title = `Scheduled for ${scheduledPublishDate.format('LLLL')}`
  } else if (hasBeenPublished) {
    title = `Post Published`
  } else {
    title = `Save and Publish`
  }
  return (
    <div className="postnavbar">
      <BlueButton
        onClick={backtoDash}
        minimal
        icon="arrow-left"
        large
        className="postnavbar__backbutton"
      >
        Back to Dashboard
      </BlueButton>
      <img src={logo} className="logo__image" />
      <div className="pastnavbar__rightpart">
        {/* eslint-disable-next-line no-nested-ternary */}
        {savingPost ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Updating post...
            <Spinner size={Spinner.SIZE_SMALL} />
          </div>
        ) : postLastSaved ? (
          <div className="post__savedAt">
            Post last saved at {postLastSaved.format('LT')} <Icon icon="tick" />
          </div>
        ) : (
          ''
        )}
        <Popover
          position={Position.BOTTOM_RIGHT}
          className="pastnavbar__savebutton"
        >
          <button className={'publish__updates'}>
            {title} <ExpandMore />
          </button>
          <Menu large className="popover__menu">
            {hasBeenPublished ? (
              <>
                <MenuItem
                  icon="send-to"
                  text="Publish Updates"
                  onClick={publishNow}
                />
                <MenuItem
                  icon="document"
                  text="Unpublish Post"
                  onClick={unpublishPost}
                />
              </>
            ) : (
              <>
                <MenuItem
                  icon="document"
                  text="Save as a draft"
                  onClick={saveDraft}
                />
                <MenuItem
                  icon="send-to"
                  text="Publish Right Now"
                  onClick={publishNow}
                />
                {scheduledPublishDate ? (
                  <MenuItem
                    icon="cross"
                    text="Cancel Scheduled Publish"
                    onClick={cancelSchedulePublish}
                  />
                ) : (
                  <MenuItem
                    icon="time"
                    text="Schedule Publish Time"
                    onClick={schedulePublish}
                  />
                )}
              </>
            )}
          </Menu>
        </Popover>
      </div>
    </div>
  )
}
export default PostNavbar
