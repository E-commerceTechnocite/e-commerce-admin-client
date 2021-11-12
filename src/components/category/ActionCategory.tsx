import { categorySchema } from '../../util/validation/categoryValidation'
import { CategoryModel } from '../../models/category/category.model'
import { sendRequest } from '../../util/helpers/refresh'
import LoadingButton from '../loading/LoadingButton'
import { useHistory, useParams } from 'react-router'
import { useQuery } from '../../util/hook/useQuery'
import param from '../../util/helpers/queries'
import { auth } from '../../util/helpers/auth'
import TextInput from '../inputs/TextInput'
import { useEffect, useState } from 'react'
import Previous from '../previous/Previous'
import { http } from '../../util/http'
import { Formik } from 'formik'
import { config } from '../../index'
import Granted from '../Granted'
import './ActionCategory.scss'
import * as React from 'react'

interface IActionUserProps {}

interface InitialValues {
  label: string
}

const ActionCategory: React.FunctionComponent<IActionUserProps> = () => {
  const [initialValues, setInitialValues] = useState<InitialValues>()
  const [submitError, setSubmitError] = useState<string>(null)
  const [isSubmit, setIsSubmit] = useState(false)
  const params: { slug: string } = useParams()
  const history = useHistory()
  const query = useQuery()
  const queries = param()


  /**
   * Returns post or patch request for product category
   * @param data
   * @returns request
   */
  const categoryPostRequest = (data: CategoryModel) => {
    if (params.slug) {
      return http.patch(
        `${config.api}/v1/product-category/${params.slug}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            ...auth.headers,
          },
        }
      )
    }
    return http.post(`${config.api}/v1/product-category`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth.headers,
      },
    })
  }

  /**
   * Submits post or patch request for product category
   * @param data
   */
  const submitCategoryPost = async (data: CategoryModel) => {
    setSubmitError(null)
    let { error } = await sendRequest(categoryPostRequest, data)
    if (error) {
      history.push('/login')
    }
    if (query.get('page')) {
      history.push({
        pathname: '/categories',
        search: `${queries.page}${queries.search}${queries.order}${queries.q}`,
        state: { successEdit: true },
      })
    } else {
      history.push({
        pathname: '/categories',
        search: '?page=1&s=u',
        state: { success: true },
      })
    }
  }

  /**
   * Returns get request for current product category
   * @returns request
   */
  const currentCategoryRequest = () => {
    return http.get<CategoryModel>(
      `${config.api}/v1/product-category/${params.slug}`,
      {
        headers: {
          ...auth.headers,
        },
      }
    )
  }

  /**
   * Returns get request for current product category
   */
  const SubmitCurrentCategory = async () => {
    let { data, error } = await sendRequest(currentCategoryRequest)
    if (error) {
      history.push('/login')
    }
    setInitialValues({
      label: data.label,
    })
  }

  useEffect(() => {
    if (params.slug) {
      SubmitCurrentCategory().then()
    } else {
      setInitialValues({
        label: '',
      })
    }
  }, [params.slug])

  return (
    <>
      <Previous />
      <div className="action-category">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={categorySchema}
          onSubmit={(data) => {
            setIsSubmit(true)
            submitCategoryPost(data)
          }}
        >
          {({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                <div className="add-user-title">
                  {params.slug && <label>Edit category</label>}
                  {!params.slug && <label>New category</label>}
                </div>
                <TextInput name={'label'} label={'Category'} />
                {!params.slug && (
                  <Granted permissions={['c:product-category']}>
                    {!isSubmit && (
                      <button type="submit" className="action">
                        Submit
                      </button>
                    )}
                    {isSubmit && <LoadingButton />}
                  </Granted>
                )}
                {params.slug && (
                  <Granted permissions={['u:product-category']}>
                    {!isSubmit && (
                      <button type="submit" className="action">
                        Submit
                      </button>
                    )}
                    {isSubmit && <LoadingButton />}
                  </Granted>
                )}
                {submitError && (
                  <div className="global-error">{submitError}</div>
                )}
              </form>
            )
          }}
        </Formik>
      </div>
    </>
  )
}

export default ActionCategory
