import * as React from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { FC, HTMLInputTypeAttribute, useEffect, useState } from "react"
import "./AddProduct.scss"
import MediaLibraryContainer from "../components/media-library/MediaLibraryContainer"
import Slider from "react-slick"
import { PictureModel } from "../models/files/picture.model"
import { domain } from "../util/environnement"
import { http } from "../util/http"
import { useHistory } from "react-router"
import { sendRequest } from "../util/helpers/refresh"
import { PaginationMetadataModel } from "../models/pagination/pagination-metadata.model"
import { productSchema } from "../util/validation/productValidation"

export interface IAddProductProps {}

interface IFormInputProps {
  id: string
  title: string
  name?: string
}

interface IFormControlProps extends IFormInputProps {
  type: HTMLInputTypeAttribute
  currentValue: string | number
  formToParent: (data: any) => any
}

interface Option {
  name: string
  value: string
}

interface ISelectProps extends IFormInputProps {
  options: Option[]
}

interface GroupData {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  name?: string
  label?: string
}

interface TaxRuleGroup {
  meta: PaginationMetadataModel
  data: GroupData[]
}

interface CategoryOptions {
  meta: PaginationMetadataModel
  data: GroupData[]
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
  const [title, setTitle] = useState<string>("")
  const [reference, setReference] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [price, setPrice] = useState<number>(1)
  const [quantity, setQuantity] = useState<number>(1)
  const [categoryId, setCategoryId] = useState<string>("")
  const [taxRuleGroupId, setTaxRuleGroupId] = useState<string>("")
  const [picturesId, setPicturesId] = useState<string[]>([])
  const [thumbnailId, SetThumbnailId] = useState<string>("")
  const [libraryData, setLibraryData] = useState<PictureModel[]>([])
  const [taxOptions, setTaxOptions] = useState<GroupData[]>([])
  const [categoryOptions, setCategoryOptions] = useState<GroupData[]>([])
  const history = useHistory()
  const formData = {
    title,
    reference,
    description,
    price,
    quantity,
    categoryId,
    taxRuleGroupId,
    picturesId,
    thumbnailId,
  }

  ////////////////////////////////////////////////////////
  const requestSubmit = () => {
    return http.post(`${domain}/v1/product`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
  }
  const submitProduct = async () => {
    let { error } = await sendRequest(requestSubmit)
    if (error) {
      console.log(error.message)
      history.push("/login")
    }
    history.push("/products")
  }
  ////////////////////////////////////////////
  const formSubmit = async (e) => {
    e.preventDefault()
    const isValid = await productSchema
      .isValid(formData)
      .catch((err) => console.error(err.description))
    console.log(formData.picturesId, thumbnailId)

    // console.log(picturesId)
    console.log(isValid)
    // if (isValid) submitProduct().then
  }

  // Pass data image select from MediaLibrary component to here
  const libraryToParent = (data: PictureModel[]) => {
    const pics: string[] = []
    data.forEach((pic) => {
      if (libraryData.find((file) => file.id === pic.id) === undefined) {
        pics.push(pic.id)
        setLibraryData([...libraryData, pic])
      }
    })
    setPicturesId([...picturesId, ...pics])
    if (pics.length) SetThumbnailId(pics[0].toString())
  }

  // Remove image from slider
  const removeImage = (id) => {
    const libraryArray = libraryData.filter((item) => item.id !== id)
    const picturesArray = picturesId
    for (let i = 0; i < picturesArray.length; i++) {
      if (picturesArray[i] === id) picturesArray.splice(i, 1)
    }
    setLibraryData(libraryArray)
    setPicturesId(picturesArray)
    if (!picturesId.length) SetThumbnailId("")
  }

  // Get request for tax rule group form select
  const requestTax = () => {
    return http.get<TaxRuleGroup>(`${domain}/v1/tax-rule-group`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
  }
  const getTaxRuleGroup = async () => {
    let { data, error } = await sendRequest(requestTax)
    if (error) {
      history.push("/login")
    }
    setTaxRuleGroupId(data.data[0].id)
    setTaxOptions([...data.data])
  }

  // Get request for category form select
  const requestCategory = () => {
    return http.get<CategoryOptions>(`${domain}/v1/product-category`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
  }
  const getCategoryGroup = async () => {
    let { data, error } = await sendRequest(requestCategory)
    if (error) {
      history.push("/login")
    }
    setCategoryId(data.data[0].id)
    setCategoryOptions([...data.data])
  }

  // Call  the requests before render
  useEffect(() => {
    getCategoryGroup().then()
    getTaxRuleGroup().then()
  }, [])

  // Modules for Quill editor
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
                <div className="form-control">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="reference">Reference</label>
                  <input
                    type="text"
                    name="reference"
                    id="reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="category">Category</label>
                  <select
                    name="category"
                    id="category"
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    {categoryOptions.map((option, index) => (
                      <option key={index} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="price">
                <div className="form-control">
                  <label htmlFor="tax">Tax</label>
                  <select
                    name="tax"
                    id="tax"
                    onChange={(e) => setTaxRuleGroupId(e.target.value)}
                  >
                    {taxOptions.map((option, index) => (
                      <option key={index} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="pictures">
              <MediaLibraryContainer
                numberOfImages={27}
                upperPagination={false}
                libraryToParent={libraryToParent}
              />
              {!!libraryData.length && (
                <Slider className="slider" {...settings}>
                  {libraryData.map((image) => (
                    <div className="slide" key={image.id}>
                      <div
                        className="top-border"
                        onClick={() => removeImage(image.id)}
                      >
                        <i className="fas fa-window-close"></i>
                      </div>
                      <img src={domain + image.uri} />
                    </div>
                  ))}
                </Slider>
              )}
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
function capitalize(name: string): string {
  throw new Error("Function not implemented.")
}
