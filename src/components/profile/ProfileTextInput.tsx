import * as React from 'react'
import './ProfileTextInput.scss'

interface ITextInputProps {
  information: string
  label?: string
}

const ProfileTextInput: React.FunctionComponent<ITextInputProps> = (props) => {
  return ( <>
      <div className="profileLabel">
        <h4>{props.label}</h4>
      </div>
      <div className="profileEntry">
        <input
          type="text"
          name={props.label}
          value={props.information}
          disabled
        />
      </div>
    </>
  )
}

export default ProfileTextInput