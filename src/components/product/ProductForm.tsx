import './ProductForm.scss'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Previous from '../previous/Previous'
import { Field, Formik } from 'formik'
import {
  imagesSchema,
  productSchema,
} from '../../util/validation/productValidation'
import TextInput from '../inputs/TextInput'
import Select from '../inputs/Select'
import NumberInput from '../inputs/NumberInput'
import { config } from '../../index'
import Slider from 'react-slick'
import MediaLibraryContainer from '../media-library/MediaLibraryContainer'
import DraftTestEditor from '../inputs/DraftTextEditor'
import * as React from 'react'
import { FC, useEffect, useState } from 'react'
import { http } from '../../util/http'
import { sendRequest } from '../../util/helpers/refresh'
import { PaginationModel } from '../../models/pagination/pagination.model'
import { ProductCategoryModel } from '../../models/product/product-category.model'
import { PictureModel } from '../../models/files/picture.model'
import { useHistory, useParams } from 'react-router'
import { ProductModel } from '../../models/product/product.model'
import Loading from '../loading/Loading'
import { auth } from '../../util/helpers/auth'
import { TaxRuleGroupModel } from '../../models/product/tax-rule-group.model'
import { motion } from 'framer-motion'

interface FormValuesInterface {
  title: string
  reference: string
  stock?: {
    physical: number | null
    pending?: number | null
    incoming?: number | null
  }
  price: number | string
  description: string
  categoryId: string
  taxRuleGroupId: string
}

interface ProductFormPropsInterface {
  productId?: string
  submitButtonContent?: string
}

const ProductForm: FC<ProductFormPropsInterface> = ({
  productId = null,
  submitButtonContent = 'Add product',
}) => {
  const [categoryId, setCategoryId] = useState<string>('')
  const [categoryOptions, setCategoryOptions] = useState<
    ProductCategoryModel[]
  >([])
  const [taxRuleGroupId, setTaxRuleGroupId] = useState<string>('')
  const [taxOptions, setTaxOptions] = useState<TaxRuleGroupModel[]>([])
  const [thumbnail, setThumbnail] = useState<PictureModel | null>(null)
  const [picturesId, setPicturesId] = useState<string[]>([])
  const [fileError, setFileError] = useState<boolean>(false)
  const [libraryData, setLibraryData] = useState<PictureModel[]>([])
  const [product, setProduct] = useState<ProductModel>()
  const params: { slug: string } = useParams()
  const history = useHistory()

  let [initialValues, setInitialValues] = useState<FormValuesInterface>({
    title: '',
    reference: '',
    stock: {
      physical: null,
      pending: 0,
      incoming: 0,
    },
    price: '',
    description: '',
    categoryId: '',
    taxRuleGroupId: '',
  })

  /**
   * Check if image in slide is the thumb
   * @param thumbId
   * @param currentImage
   * @returns boolean
   */
  const isThumb = (thumbId: string, currentImage: string) => {
    if (thumbId === currentImage) return true
  }

  /**
   * Returns post or patch request for product
   * @param data
   * @returns  post | patch -> request
   */
  const productRequest = (data: { id: string; content: any }) => {
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...auth.headers,
      },
    }
    return data.id
      ? http.patch(
          `${config.api}/v1/product/${data.id}`,
          data.content,
          requestOptions
        )
      : http.post(`${config.api}/v1/product`, data.content, requestOptions)
  }
  /**
   * Submits post or patch request for product
   * Check if images and thumbnail are valid before submitting
   * @param data
   */
  const submitProduct = async (data) => {
    const file = {
      picturesId,
      thumbnailId: thumbnail?.id,
    }
    try {
      const isValid = await imagesSchema.validate(file)
      if (isValid) {
        setFileError(false)
        data = { ...data, ...file }
        let { error } = await sendRequest(productRequest, {
          id: productId,
          content: data,
        })
        if (error) {
          console.error(error.message)
          history.push({
            pathname: '/login',
          })
        }
        history.push({
          pathname: '/products',
          state: { success: true },
        })
      }
    } catch {
      setFileError(true)
    }
  }

  /**
   * Returns get request tax list for select input
   * @returns request
   */
  const requestTax = () => {
    return http.get<PaginationModel<TaxRuleGroupModel>>(
      `${config.api}/v1/tax-rule-group`,
      {
        headers: { ...auth.headers },
      }
    )
  }
  /**
   * Submits get request tax list for select input
   */
  const getTaxRuleGroup = async () => {
    let { data, error } = await sendRequest(requestTax)
    if (error) {
      // TODO show error on client (does not have permission)
      history.push('/login')
    }
    setTaxRuleGroupId(data.data[0].id)
    setTaxOptions([...data.data])
  }

  /**
   * Returns get request category list for select input
   * @returns request
   */
  const requestCategory = () => {
    return http.get<PaginationModel<ProductCategoryModel>>(
      `${config.api}/v1/product-category`,
      {
        headers: { ...auth.headers },
      }
    )
  }
  /**
   * Submits get request category list for select input
   */
  const getCategoryGroup = async () => {
    let { data, error } = await sendRequest(requestCategory)
    if (error) {
      // TODO show error on client (does not have permission)
      history.push('/login')
    }
    setCategoryId(data.data[0].id)
    setCategoryOptions([...data.data])
  }

  /**
   * Pass data of images selected from MediaLibrary component to this component
   * @param data
   */
  const libraryToParent = (data: PictureModel) => {
    if (libraryData.find((file) => file.id === data.id) === undefined) {
      setPicturesId((ids) => [...ids, data.id])
      setLibraryData((ids) => [...ids, data])
    }
    if (picturesId.length < 1) setThumbnail(data)
  }

  /**
   * Remove image from slider
   * @param id
   */
  const removeImage = (id) => {
    setLibraryData((lib) => lib.filter((item) => item.id !== id))
    setPicturesId((picIds) => picIds.filter((picId) => picId !== id))
    setThumbnail(null)
  }

  /**
   * Returns get request for current product information
   * @returns request
   */
  const requestProduct = () => {
    return http.get<ProductModel>(`${config.api}/v1/product/${params.slug}`, {
      headers: { ...auth.headers },
    })
  }
  /**
   * Sends request and updates field values in form
   */
  const getProduct = async () => {
    let { data, error } = await sendRequest(requestProduct)
    if (error) {
      history.push('/login')
    }
    setInitialValues({
      categoryId: data.category.id,
      taxRuleGroupId: data.taxRuleGroup.id,
      description: data.description,
      price: data.price,
      stock: {
        physical: data.stock.physical,
        pending: 0,
        incoming: 0,
      },
      title: data.title,
      reference: data.reference,
    })
    data.pictures.map((file) => {
      setPicturesId((picture) => [...picture, file.id])
    })
    setLibraryData((file) => [...file, ...data.pictures])
    setThumbnail(data.thumbnail)
    setProduct(data)
  }

  // Slider settings
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    vertical: true,
    verticalSwiping: true,
  }

  useEffect(() => {
    getCategoryGroup().then()
    getTaxRuleGroup().then()
  }, [])

  useEffect(() => {}, [thumbnail])

  // Get product information
  useEffect(() => {
    if (productId) {
      getProduct().then()
    } else {
      setProduct({})
    }
  }, [params.slug])

  return (
    <>
      {productId && !product && <Loading />}
      {product && (
        <>
          <Previous />
          <div className="product-form">
            <Formik
              initialValues={initialValues}
              validationSchema={productSchema}
              onSubmit={async (data) => {
                // console.log(data)
                await submitProduct(data)
              }}
            >
              {({
                setFieldValue,
                setFieldTouched,
                handleSubmit,
                values,
                errors,
              }) => {
                console.log(values.stock.physical)
                console.log(errors)
                return (
                  <form onSubmit={handleSubmit}>
                    <div className="top">
                      <div className="inputs">
                        <div className="product">
                          <TextInput name={'title'} label={'Title'} />
                          <TextInput name={'reference'} label={'Reference'} />
                          <Select
                            name={'categoryId'}
                            label={'Category'}
                            options={categoryOptions}
                          />
                        </div>
                        <div className="price">
                          <Select
                            name={'taxRuleGroupId'}
                            label={'Tax'}
                            options={taxOptions}
                          />
                          <NumberInput
                            name={'stock.physical'}
                            label={'Quantity'}
                          />
                          <NumberInput name={'price'} label={'Price'} />
                        </div>
                      </div>
                      <div className="current-images">
                        <picture>
                          {!thumbnail && (
                            <div
                              className="placeholder"
                              onClick={() => console.log(thumbnail)}
                            >
                              Select an image to set the thumbnail
                            </div>
                          )}
                          {thumbnail && (
                            <div
                              className="placeholder"
                              onClick={() => console.log(thumbnail)}
                            >
                              <img
                                src={`${config.api + thumbnail.uri}`}
                                alt={thumbnail.title}
                              />
                            </div>
                          )}
                        </picture>
                        {!!libraryData.length && (
                          <Slider className="slider" {...settings}>
                            {libraryData.map((image) => (
                              <motion.picture
                                className={`slide ${
                                  isThumb(thumbnail.id, image.id)
                                    ? 'is-thumb'
                                    : ''
                                }`}
                                key={image.id}
                                whileTap={{
                                  scale: 0.98,
                                  transition: { duration: 0.1 },
                                }}
                                onClick={() => setThumbnail(image)}
                              >
                                <div
                                  className="top-border"
                                  onClick={() => removeImage(image.id)}
                                >
                                  <i className="fas fa-window-close" />
                                </div>
                                <img
                                  src={config.api + image.uri}
                                  alt={image.caption}
                                />
                              </motion.picture>
                            ))}
                          </Slider>
                        )}
                      </div>
                    </div>
                    <div className="pictures">
                      <MediaLibraryContainer
                        numberOfImages={38}
                        upperPagination={false}
                        mini={true}
                        libraryToParent={libraryToParent}
                      />
                      {fileError && <div className="error">Select a file</div>}
                    </div>
                    <div className="description">
                      <Field
                        value={values.description}
                        name="description"
                        component={DraftTestEditor}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                      />
                    </div>
                    <div className="buttons">
                      <button className="action" type="submit">
                        {submitButtonContent ?? 'Add product'}
                      </button>
                    </div>
                  </form>
                )
              }}
            </Formik>
          </div>
        </>
      )}
    </>
  )
}

export default ProductForm
