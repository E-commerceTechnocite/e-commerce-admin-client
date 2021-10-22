import * as React from 'react'
import { useEffect, useState } from 'react'
import './Skeleton.scss'

interface IMediaLibrarySkeletonProps {
  nbFrames: number
}

const MediaLibrarySkeleton: React.FunctionComponent<IMediaLibrarySkeletonProps> =
  ({ nbFrames }) => {
    const [frames, setFrames] = useState([])
    useEffect(() => {
      const frame = []
      for (var i = 0; i < nbFrames; i++) {
        frame.push(i)
      }
      setFrames([...frame])
      console.log()
    }, [])

    return (
      <div className="skeleton">
        <div className="images">
          {frames.map((frame, index) => (
            <div key={index}></div>
          ))}
        </div>
        <div className="pagination">
          <div></div>
        </div>
      </div>
    )
  }

export default MediaLibrarySkeleton
