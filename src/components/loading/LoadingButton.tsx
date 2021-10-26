import * as React from 'react'

const LoadingButton: React.FunctionComponent = () => {
  return (
    <button type="button" className="loading-button action">
      <i className="fas fa-spinner fa-pulse" style={{ color: 'white' }} />
    </button>
  )
}

export default LoadingButton
