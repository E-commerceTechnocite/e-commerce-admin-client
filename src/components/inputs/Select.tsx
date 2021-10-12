import { useField } from "formik"
import * as React from "react"
import { useEffect } from "react"

interface ISelectProps {
  name: string
  label?: string
  options: {}[]
}

interface Options {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  label?: string
  name?: string
}

const Select: React.FunctionComponent<ISelectProps> = (props) => {
  const [field, meta] = useField(props.name)
  return (
    <div className="form-control">
      {props.label && <label htmlFor={props.name}>{props.label}</label>}
      <select {...field} {...props}>
        {props.options.map((option: Options, index: number) => (
          <option key={index} value={option.id}>
            {option.label}
            {option.name}
          </option>
        ))}
      </select>
      {meta.error && meta.touched && <p className="error">{meta.error}</p>}
    </div>
  )
}

export default Select