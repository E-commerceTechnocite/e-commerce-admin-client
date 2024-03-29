import { ErrorMessage, useField } from 'formik'
import * as React from 'react'
import './Validation.scss'

interface ITextInputProps {
  name: string
  label?: string
}

const TextInput: React.FunctionComponent<ITextInputProps> = (props) => {
  const [field, meta] = useField(props.name)
  return (
    <div className="form-control">
      {props.label && <label htmlFor={props.name}>{props.label}</label>}
      <textarea {...field} {...props} />
      <p className="error">
        <ErrorMessage name={props.name} data-cy={`${props.name}-error`}/>
      </p>
    </div>
  )
}

export default TextInput
