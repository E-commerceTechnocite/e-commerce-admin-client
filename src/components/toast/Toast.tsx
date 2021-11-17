import * as React from 'react'
import { useEffect, useState } from 'react'
import './Toast.scss'

interface IToastProps {
  name: string
  success: boolean
  edit?: boolean
}

const Toast: React.FunctionComponent<IToastProps> = ({
  name,
  success,
  edit,
}) => {
  const [toast, setToast] = useState(false)
  useEffect(() => {
    if (success === true) {
      setToast(true)
      setTimeout(() => {
        setToast(false)
      }, 10000)
    }
  }, [success])
  // ${!toast ? 'hidden-fade' : ''}
  return (
    <>
      {success && (
        <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
          {' '}
          <i className="fas fa-check" />
          {!edit && <p>{name} Added</p>}
          {edit && <p>{name} Edited</p>}
          <i className="fas fa-times close" onClick={() => setToast(false)} />
        </div>
      )}
    </>
  )
}

export default Toast
