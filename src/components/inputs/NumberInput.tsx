import { useField } from 'formik'
import * as React from 'react'
import './Validation.scss'

interface INumberInputProps {
  name: string
  label?: string
}

const NumberInput: React.FunctionComponent<INumberInputProps> = (props) => {
  const [field, meta] = useField(props.name)
  return (
    <div className="form-control">
      {props.label && <label htmlFor={props.name}>{props.label}</label>}
      <input type="number" {...field} {...props} />
      {meta.error && meta.touched && <p className="error" data-cy={`${props.name}-error`}>{meta.error}</p>}
    </div>
  )
}

export default NumberInput
