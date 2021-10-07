import * as React from "react"
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
import { Formik, Form, ErrorMessage } from "formik"
import TextInput from "../components/inputs/TextInput"
import Select from "../components/inputs/Select"
import NumberInput from "../components/inputs/NumberInput"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { CKEditor } from "@ckeditor/ckeditor5-react"

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
    /* try {
      const isValid: ProductPost = await productSchema
        .validate(formData, { abortEarly: false })
      console.log(isValid)
    } catch(err) {
      console.error(err)
    } */

    productSchema
      .validate(formData, { abortEarly: false })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
    // console.log(picturesId, thumbnailId)
    // console.log(picturesId)
    // console.log(isValid)
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

  // CKEditor

  // Slider settings
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
        <Formik
          initialValues={{
            title: "",
            reference: "",
            quantity: 0,
            price: 0,
            description: "",
          }}
          validationSchema={productSchema}
          onSubmit={(data) => {
            // form.setTouched({...form.touched,[field.name]: true });
          }}
        >
          {({ setFieldValue, setTouched, values, errors, touched, handleBlur, handleChange }) => {
            console.log(touched)
            return (
              <Form onSubmit={formSubmit}>
                <div className="top">
                  <div className="inputs">
                    <div className="product">
                      <TextInput name={"title"} label={"Title"} />
                      <TextInput name={"reference"} label={"Reference"} />
                      <Select
                        name={"category"}
                        label={"Category"}
                        options={categoryOptions}
                      />
                    </div>
                    <div className="price">
                      <Select name={"tax"} label={"Tax"} options={taxOptions} />
                      <NumberInput name={"quantity"} label={"Quantity"} />
                      <NumberInput name={"price"} label={"Price"} />
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
                  <CKEditor
                    id="inputText"
                    name={"description"}
                    className="inputText"
                    editor={ClassicEditor}
                    data={values.description}
                    onChange={(e, editor) =>{
                      // handleChange
                      touched.description
                      setFieldValue("description", editor.getData(), true)
                    }}
                  />
                  <p className="error">
                    <ErrorMessage name="description" />
                  </p>
                </div>
                <div className="buttons">
                  <button className="action" type="submit">
                    Add Product
                  </button>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </>
  )
}
export default AddProduct
