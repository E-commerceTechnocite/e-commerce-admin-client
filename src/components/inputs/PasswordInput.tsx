import { ErrorMessage, useField } from "formik"
import * as React from "react"
import "./Validation.scss"

interface IPasswordInputProps {
  name: string
  label?: string
  placeholder?: string
}

const PasswordInput: React.FunctionComponent<IPasswordInputProps> = (props) => {
    const [field, meta] = useField(props.name)
    return (
      <div className="form-control">
        {props.label && <label htmlFor={props.name}>{props.label}</label>}
        <input type="password" {...field} {...props} placeholder={props.placeholder}/>
        <p className="error">
          <ErrorMessage name={props.name} />
        </p>
      </div>
    )
};

export default PasswordInput;
