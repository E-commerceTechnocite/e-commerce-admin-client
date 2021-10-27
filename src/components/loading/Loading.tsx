import * as React from 'react'
import './Loading.scss'

const Loading: React.FunctionComponent = () => {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Loading
