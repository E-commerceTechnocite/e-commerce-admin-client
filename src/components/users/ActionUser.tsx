import { userSchema } from '../../util/validation/userValidation'
import { UserModel } from '../../models/user/user.model'
import { sendRequest } from '../../util/helpers/refresh'
import LoadingButton from '../loading/LoadingButton'
import { useHistory, useParams } from 'react-router'
import { useQuery } from '../../util/hook/useQuery'
import { auth } from '../../util/helpers/auth'
import TextInput from '../inputs/TextInput'
import { useEffect, useState } from 'react'
import Previous from '../previous/Previous'
import { http } from '../../util/http'
import { Formik } from 'formik'
import Select from '../inputs/Select'
import { config } from '../../index'
import * as React from 'react'
import './ActionUser.scss'

interface InitialValues {
  email: string
  username: string
  roleId: string
}

const ActionUser: React.FunctionComponent = () => {
  const [initialValues, setInitialValues] = useState<InitialValues>()
  const [submitError, setSubmitError] = useState<string>(null)
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [allRoles, setAllRoles] = useState([])
  const [roles, setRoles] = useState([])
  const params: { slug: string } = useParams()
  const history = useHistory()
  const query = useQuery()

  /**
   * Returns post or patch request for user
   * @param data
   * @returns request
   */
  const userPostRequest = (data: UserModel) => {
    if (params.slug) {
      return http.patch(`${config.api}/v1/user/${params.slug}`, data, {
        headers: {
          'Content-Type': 'application/json',
          ...auth.headers,
        },
      })
    }
    return http.post(`${config.api}/v1/user`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth.headers,
      },
    })
  }

  /**
   * Submits post or patch request for user
   * @param data
   * @returns void
   */
  const submitUserPost = async (data: UserModel) => {
    setSubmitError(null)
    let { error } = await sendRequest(userPostRequest, data)
    if (error) {
      if (error.statusCode === 400) {
        setIsSubmit(false)
        setSubmitError('Username or Email already used')
        return
      }
      history.push('/login')
    }
    if (query.get('page')) {
      history.push({
        pathname: '/users',
        search: `?page=${query.get('page')}&s=u${
          query.get('search') && query.get('order')
            ? `&search=${query.get('search')}&order=${query.get('order')}`
            : ``
        }`,
        state: { successEdit: true },
      })
    } else {
      history.push({
        pathname: '/users',
        search: `?page=1&s=u`,
        state: { success: true },
      })
    }
  }

  /**
   * Returns get request for role list
   * @returns request
   */
  const roleRequest = () => {
    return http.get<any>(`${config.api}/v1/role/all`, {
      headers: {
        ...auth.headers,
      },
    })
  }

  /**
   * Submits get request for role list
   */
  const SubmitRole = async () => {
    let { data, error } = await sendRequest(roleRequest)
    if (error) {
      history.push('/login')
    }
    setRoles(data)
  }

  const allRoleRequest = () => {
    return http.get<string[]>(`${config.api}/v1/role/all`, {
      headers: {
        ...auth.headers,
      },
    })
  }

  const SubmitAllRole = async () => {
    let { data, error } = await sendRequest(allRoleRequest)
    if (error) {
      history.push('/login')
    }
    setAllRoles(data)
  }

  useEffect(() => {
    SubmitRole().then()
    SubmitAllRole().then()
  }, [])

  const currentUserRequest = () => {
    return http.get<UserModel>(`${config.api}/v1/user/${params.slug}`, {
      headers: {
        ...auth.headers,
      },
    })
  }

  const SubmitCurrentUser = async () => {
    let { data, error } = await sendRequest(currentUserRequest)
    if (error) {
      history.push('/login')
    }
    setInitialValues({
      email: data.email,
      username: data.username,
      roleId: data.role.id,
    })
  }

  useEffect(() => {
    if (params.slug) {
      SubmitCurrentUser().then()
    } else {
      setInitialValues({
        email: '',
        username: '',
        roleId: '',
      })
    }
  }, [params.slug])

  return (
    <>
      <Previous />
      {roles && (
        <div className="action-user">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={userSchema}
            onSubmit={(data) => {
              setIsSubmit(true)
              submitUserPost(data)
            }}
          >
            {({ handleSubmit }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <div className="add-user-title">
                    {params.slug && <label>Edit user</label>}
                    {!params.slug && <label>New user</label>}
                  </div>
                  <Select name={'roleId'} label={'Role'} options={allRoles} />
                  <TextInput name={'username'} label={'Username'} />
                  <TextInput name={'email'} label={'E-mail'} />
                  {!isSubmit && (
                    <button type="submit" className="action">
                      Submit
                    </button>
                  )}
                  {isSubmit && <LoadingButton />}
                  {submitError && (
                    <div className="global-error">{submitError}</div>
                  )}
                </form>
              )
            }}
          </Formik>
        </div>
      )}
    </>
  )
}

export default ActionUser
