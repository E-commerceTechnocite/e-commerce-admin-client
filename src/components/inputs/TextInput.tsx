import { useField } from 'formik';
import * as React from 'react';
import './TextInput.scss'

interface ITextInputProps {
    name: string
    label?: string
}

const TextInput: React.FunctionComponent<ITextInputProps> = (props) => {
    const [field, meta] = useField(props.name)
  return (
      <div className="form-control">
          {props.label && <label htmlFor={props.name}>{props.label}</label>}
          <input {...field} {...props}/>
          {meta.error && meta.touched && <p className="error">{meta.error}</p>}
      </div>
  );
};

export default TextInput;
