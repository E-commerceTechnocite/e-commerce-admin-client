import * as React from "react"
import { FC, useEffect, useState } from "react"
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
import { Formik, Field } from "formik"
import TextInput from "../components/inputs/TextInput"
import Select from "../components/inputs/Select"
import NumberInput from "../components/inputs/NumberInput"
import DrafTextEditor from "../components/inputs/DraftTextEditor"

export interface IAddProductProps {}

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

const AddProduct: FC<IAddProductProps> = () => {
  const [categoryId, setCategoryId] = useState<string>("")
  const [taxRuleGroupId, setTaxRuleGroupId] = useState<string>("")
  const [picturesId, setPicturesId] = useState<string[]>([])
  const [thumbnailId, SetThumbnailId] = useState<string>("")
  const [libraryData, setLibraryData] = useState<PictureModel[]>([])
  const [taxOptions, setTaxOptions] = useState<GroupData[]>([])
  const [categoryOptions, setCategoryOptions] = useState<GroupData[]>([])
  const history = useHistory()

  // Send request data from form submit
  const requestSubmit = (data) => {
    return http.post(`${domain}/v1/product`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
  }
  const submitProduct = async (data) => {
    let { error } = await sendRequest(requestSubmit, data)
    if (error) {
      console.error(error.message)
      history.push("/login")
    }
    history.push("/products")
  }

  // Pass dataof images selected from MediaLibrary component to here
  const libraryToParent = (data: PictureModel) => {
    console.log(data)
    if (libraryData.find((file) => file.id === data.id) === undefined) {
      setPicturesId((ids) => [...ids, data.id])
      setLibraryData((ids) => [...ids, data])
    }

    if (picturesId.length < 1) SetThumbnailId(data.id)
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
          enableReinitialize={true}
          initialValues={{
            title: "",
            reference: "",
            quantity: 0,
            price: 0,
            description: "",
            categoryId: categoryId,
            taxRuleGroupId: taxRuleGroupId,
            picturesId: picturesId,
            thumbnailId: thumbnailId,
          }}
          validationSchema={productSchema}
          onSubmit={(data) => {
            submitProduct(data)
          }}
        >
          {({
            setFieldValue,
            setFieldTouched,
            handleSubmit,
            values,
            errors,
          }) => {
            return (
              <form onSubmit={handleSubmit}>
                <div className="top">
                  <div className="inputs">
                    <div className="product">
                      <TextInput name={"title"} label={"Title"} />
                      <TextInput name={"reference"} label={"Reference"} />
                      <Select
                        name={"categoryId"}
                        label={"Category"}
                        options={categoryOptions}
                      />
                    </div>
                    <div className="price">
                      <Select
                        name={"taxRuleGroupId"}
                        label={"Tax"}
                        options={taxOptions}
                      />
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
                    {errors.thumbnailId && (
                      <div className="error">Select a file</div>
                    )}
                  </div>
                </div>
                <div className="description">
                  <Field
                    value={values.description}
                    name="description"
                    component={DrafTextEditor}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                  />
                </div>
                <div className="buttons">
                  <button className="action" type="submit">
                    Add Product
                  </button>
                </div>
              </form>
            )
          }}
        </Formik>
      </div>
    </>
  )
}
export default AddProduct
