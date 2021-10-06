import { useField } from 'formik';
import * as React from 'react';

interface ITextInputProps {
    name: string
    label?: string
}

const TextInput: React.FunctionComponent<ITextInputProps> = (props, {name, label}) => {
    const [field, meta] = useField(name)
  return (
      <div className="text-input">
          {label && <label htmlFor={name}>{label}</label>}
          <input {...field} {...props} />
          {meta.error && meta.touched && <p className="error">{meta.error}</p>}
      </div>
  );
};

export default TextInput;
