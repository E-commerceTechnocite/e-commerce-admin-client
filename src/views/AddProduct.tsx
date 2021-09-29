import * as React from "react";
import { FC, HTMLInputTypeAttribute } from "react";
import "./AddProduct.scss";

export interface IAddProductProps {}

interface IFormInputProps {
  id: string;
  title: string;
  name?: string;
}

interface IFormControlProps extends IFormInputProps {
  type: HTMLInputTypeAttribute;
}

interface Option {
  name: string;
  value: string;
}

interface ISelectProps extends IFormInputProps {
  options: Option[];
}

const AddProduct: FC<IAddProductProps> = () => {
  const formSubmit = (e) => {
    e.preventDefault();
  };

  const FormControl: FC<IFormControlProps> = ({ type, id, title, name }) => (
    <div className="form-control">
      <label htmlFor={id}>{title}</label>
      <input type={type} name={name} id={id} />
    </div>
  );

  const Select: FC<ISelectProps> = ({ options, id, title, name }) => (
    <>
      <div className="form-control">
        <label htmlFor={id}>{title}</label>
        <select name={name} id={id}>
          {options.map((option) => (
            <option value={option.value}>{option.name}</option>
          ))}
        </select>
      </div>
    </>
  );

  const categoryOptions: Option[] = [
    { name: "Electronics", value: "1" },
    { name: "Computers", value: "2" },
    { name: "Cooking", value: "3" },
  ];

  const taxOptions: Option[] = [
    { name: "Alcohol", value: "1" },
    { name: "Goods", value: "2" },
  ];

  return (
    <>
      <div className="product-form">
        <form onSubmit={formSubmit}>
          <div className="top">
            <div className="inputs">
              <div className="product">
                <FormControl type="text" title="Title" id="title" />
                <FormControl type="text" title="Reference" id="reference" />
                <Select
                  options={categoryOptions}
                  id="category-select"
                  title="Category"
                />
              </div>
              <div className="price">
                <Select options={taxOptions} id="category-select" title="Tax" />
                <FormControl type="number" id="price" title="Price" />
              </div>
            </div>
            <div className="pictures"></div>
          </div>
          <div className="description"></div>
          <div className="buttons">
            <button type="submit">ADD</button>
            <button type="button">PREVIEW</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
