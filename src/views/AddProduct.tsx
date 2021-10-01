import * as React from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { FC, HTMLInputTypeAttribute, useEffect, useState } from "react"
import "./AddProduct.scss"
import MediaLibraryContainer from "../components/media-library/MediaLibraryContainer"
import Slider from "react-slick"

export interface IAddProductProps {}

interface IFormInputProps {
  id: string
  title: string
  name?: string
}

interface IFormControlProps extends IFormInputProps {
  type: HTMLInputTypeAttribute
}

interface Option {
  name: string
  value: string
}

interface ISelectProps extends IFormInputProps {
  options: Option[]
}

interface ProductPost {
  title: string
  reference: string
  description: string
  price: number
  categoryId: string
  taxRuleGroupId: string
  picturesId: string[]
  thumbnailId: string
}

const AddProduct: FC<IAddProductProps> = () => {
  /*  const [title, setTitle] = useState<string>("")
  const [reference, setReference] = useState<string>("") */
  const [description, setDescription] = useState<string>("")
  /*  const [price, setPrice] = useState<number | null>(null)
  const [categoryId, setCategoryId] = useState<string>("")
  const [taxRuleGroupId, setTaxRuleGroupId] = useState<string>("")
  const [picturesId, setPicturesId] = useState<string[]>([])
  const [thumbnailId, SetThumbnailId] = useState<string>("") */
  const formSubmit = (e) => {
    e.preventDefault()
  }
  useEffect(() => {}, [])

  const FormControl: FC<IFormControlProps> = ({ type, id, title, name }) => (
    <div className="form-control">
      <label htmlFor={id}>{title}</label>
      <input type={type} name={name} id={id} /> {/* onChange={`set${name}`} */}
    </div>
  )

  const Select: FC<ISelectProps> = ({ options, id, title, name }) => (
    <>
      <div className="form-control">
        <label htmlFor={id}>{title}</label>
        <select name={name} id={id}>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </>
  )

  const categoryOptions: Option[] = [
    { name: "Electronics", value: "1" },
    { name: "Computers", value: "2" },
    { name: "Cooking", value: "3" },
  ]

  const taxOptions: Option[] = [
    { name: "Alcohol", value: "1" },
    { name: "Goods", value: "2" },
  ]

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ size: ["small", false, "large", "huge"] }, { color: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
          { align: [] },
        ],
        ["link", "image", "video"],
        ["clean"],
      ],
    },
    clipboard: { matchVisual: false },
  }

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "size",
    "color",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
  ]

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
  }

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
            <div className="pictures">
              <MediaLibraryContainer
                numberOfImages={27}
                upperPagination={false}
              />
              <Slider className="slider" {...settings}>
                <div className="slide">
                  <img src="http://placekitten.com/g/400/200" />
                </div>
                <div className="slide">
                  <img src="http://placekitten.com/g/400/200" />
                </div>
                <div className="slide">
                  <img src="http://placekitten.com/g/400/200" />
                </div>
                <div className="slide">
                  <img src="http://placekitten.com/g/400/200" />
                </div>
                <div className="slide">
                  <img src="http://placekitten.com/g/400/200" />
                </div>
                <div className="slide">
                  <img src="http://placekitten.com/g/400/200" />
                </div>
                <div className="slide">
                  <img src="http://placekitten.com/g/400/200" />
                </div>
                <div className="slide">
                  <img src="http://placekitten.com/g/400/200" />
                </div>
                <div className="slide">
                  <img src="http://placekitten.com/g/400/200" />
                </div>
                <div className="slide">
                  <img src="http://placekitten.com/g/400/200" />
                </div>
              </Slider>
            </div>
          </div>
          <div className="description">
            <ReactQuill
              theme="snow"
              modules={modules}
              formats={formats}
              value={description}
              onChange={setDescription}
            />
          </div>
          <div className="buttons">
            <button className="action" type="submit">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddProduct
