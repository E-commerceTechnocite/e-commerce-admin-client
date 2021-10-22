import * as React from 'react'
import { FC } from 'react'
import MediaLibraryContainer from '../components/media-library/MediaLibraryContainer'

const MediaLibrary: FC = () => {
  return (
    <>
      <div className="media-library-view">
        <MediaLibraryContainer />
      </div>
    </>
  )
}

export default MediaLibrary
