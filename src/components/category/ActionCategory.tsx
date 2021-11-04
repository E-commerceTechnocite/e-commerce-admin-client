import * as React from 'react'
import { useHistory, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { http } from '../../util/http'
import { config } from '../../index'
import { Formik, Field } from 'formik'
import TextInput from '../inputs/TextInput'
import { sendRequest } from '../../util/helpers/refresh'
import { categorySchema } from '../../util/validation/categoryValidation'
import './ActionCategory.scss'
import Previous from '../previous/Previous'
import { CategoryModel } from '../../models/category/category.model'
import { useQuery } from '../../util/hook/useQuery'

interface IActionUserProps {}

interface InitialValues {
  label: string
}

const ActionCategory: React.FunctionComponent<IActionUserProps> = () => {
  const history = useHistory()
  const [submitError, setSubmitError] = useState<string>(null)
  const params: { slug: string } = useParams()
  const [initialValues, setInitialValues] = useState<InitialValues>()
  const query = useQuery()

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
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      )
    }
    return http.post(`${config.api}/v1/product-category`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
        search: `?page=${query.get('page')}`,
        state: { successEdit: true },
      })
    } else {
      history.push({
        pathname: '/categories',
        search: '?page=1',
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
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
                <button type="submit" className="action">
                  Submit
                </button>
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
