import { ProductCategoryModel } from '../../models/product/product-category.model'
import { TaxRuleGroupModel } from '../../models/product/tax-rule-group.model'
import MediaLibraryContainer from '../media-library/MediaLibraryContainer'
import { PaginationModel } from '../../models/pagination/pagination.model'
import { ProductModel } from '../../models/product/product.model'
import { PictureModel } from '../../models/files/picture.model'
import { sendRequest } from '../../util/helpers/refresh'
import DraftTestEditor from '../inputs/DraftTextEditor'
import { useHistory, useParams } from 'react-router'
import LoadingButton from '../loading/LoadingButton'
import { useQuery } from '../../util/hook/useQuery'
import { FC, useEffect, useState } from 'react'
import NumberInput from '../inputs/NumberInput'
import param from '../../util/helpers/queries'
import { auth } from '../../util/helpers/auth'
import 'slick-carousel/slick/slick-theme.css'
import TextInput from '../inputs/TextInput'
import Previous from '../previous/Previous'
import Loading from '../loading/Loading'
import 'slick-carousel/slick/slick.css'
import { http } from '../../util/http'
import { Field, Formik } from 'formik'
import { motion } from 'framer-motion'
import Select from '../inputs/Select'
import { config } from '../../index'
import Slider from 'react-slick'
import * as React from 'react'
import './ProductForm.scss'
import {
  imagesSchema,
  productSchema,
} from '../../util/validation/productValidation'

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
  const [thumbnail, setThumbnail] = useState<PictureModel | null>(null)
  const [taxOptions, setTaxOptions] = useState<TaxRuleGroupModel[]>([])
  const [libraryData, setLibraryData] = useState<PictureModel[]>([])
  const [picturesId, setPicturesId] = useState<string[]>([])
  const [fileError, setFileError] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string>('')
  const [product, setProduct] = useState<ProductModel>()
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [categoryOptions, setCategoryOptions] = useState<
    ProductCategoryModel[]
  >([])
  const params: { slug: string } = useParams()
  const history = useHistory()
  const query = useQuery()
  const queries = param()

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
  const isThumb = (thumbId: string | null, currentImage: string | null) => {
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
        if (query.get('page')) {
          history.push({
            pathname: '/products',
            search: `${queries.page('page')}${queries.search(
              'search'
            )}${queries.order('order')}${queries.q('q')}`,
            state: { successEdit: true },
          })
        } else {
          history.push({
            pathname: '/products',
            search: `${queries.page}&s=u`,
            state: { success: true },
          })
        }
      }
    } catch {
      setFileError(true)
      setSubmitError('Select an image')
      setIsSubmit(false)
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
  const removeImage = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.stopPropagation()
    setLibraryData((lib) => lib.filter((item) => item.id !== id))
    setPicturesId((picIds) => picIds.filter((picId) => picId !== id))
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

  useEffect(() => {
    if (libraryData.length > 0) {
      setThumbnail(libraryData[0])
    } else {
      setThumbnail(null)
    }
  }, [libraryData])

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
                setIsSubmit(true)
                await submitProduct(data)
              }}
            >
              {({ setFieldValue, setFieldTouched, handleSubmit, values }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <div className="add-user-title">
                      {params.slug && <label>Edit product</label>}
                      {!params.slug && <label>New product</label>}
                    </div>
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
                            <div className="placeholder">
                              Select an image to set the thumbnail
                            </div>
                          )}
                          {thumbnail && (
                            <div className="placeholder">
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
                                  onClick={(e: React.MouseEvent<HTMLElement>) =>
                                    removeImage(e, image.id)
                                  }
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
                        {fileError && <p className="error">Select a file</p>}
                      </div>
                    </div>
                    <div className="pictures">
                      <MediaLibraryContainer
                        numberOfImages={38}
                        upperPagination={false}
                        mini={true}
                        libraryToParent={libraryToParent}
                      />
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
                      {!isSubmit && (
                        <button className="action" type="submit">
                          {submitButtonContent ?? 'Add product'}
                        </button>
                      )}
                      {isSubmit && <LoadingButton />}
                    </div>
                    {submitError && (
                      <div className="global-error">{submitError}</div>
                    )}
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
