import * as React from 'react'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import Loading from '../components/loading/Loading'
import { http } from '../util/http'
import { config } from '../index'
import { auth, Permission } from '../util/helpers/auth'
import { sendRequest } from '../util/helpers/refresh'
import { Formik } from 'formik'
import { adminLoginSchema } from '../util/validation/loginValidation'
import TextInput from '../components/inputs/TextInput'
import PasswordInput from '../components/inputs/PasswordInput'
import LoadingButton from '../components/loading/LoadingButton'

const Login: React.FunctionComponent = () => {
  const [checkbox] = useState(false)
  const [isPending, setIsPending] = useState(true)
  const [isLogging, setIsLogging] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>(null)
  const history = useHistory()

  /**
   * Returns request for persmissions list
   * @returns request
   */
  const fetchPermissions = () =>
    http.get<Permission[]>(`${config.api}/v1/o-auth/permissions`, {
      headers: { ...auth.headers },
    })

  /**
   * Set permissions
   * @param param0
   * @returns
   */
  const setPermissions = ({ data, error }) => {
    if (!error) {
      auth.permissions = data
      return history.push('/')
    }
    setIsPending(false)
  }

  // Check if the user is already logged
  useEffect(() => {
    setIsPending(true)
    if (auth.refresh) {
      sendRequest(fetchPermissions)
        .then(setPermissions)
        .then(() => setIsPending(false))
    } else {
      fetchPermissions()
        .then(setPermissions)
        .then(() => setIsPending(false))
    }
  }, [])

  /**
   * Submits credentials for connection
   * @param data
   */
  const onSubmit = (data: { email: string; password: string }): void => {
    // setIsPending(true)
    setIsLogging(true)
    setErrorMessage(null)
    const { email, password } = data
    const body = { email, password }
    const options = {
      headers: { 'Content-Type': 'application/json' },
    }
    http
      .post<{ access_token: string; refresh_token: string }>(
        `${config.api}/v1/o-auth/login`,
        body,
        options
      )
      .then(({ data, error }) => {
        const { access_token, refresh_token } = data
        if (!error) {
          auth.access = access_token
          auth.refresh = refresh_token
          sendRequest(fetchPermissions)
            .then(({ data, error }) => {
              auth.permissions = data
            })
            .then(() => {
              history.push('/')
            })
        } else {
          if (error.statusCode === 400) {
            setErrorMessage('Wrong email and/or password.')
          }
          // setIsPending(false)
    setIsLogging(false)

        }
      })
  }

  return (
    <>
      {isPending && <Loading />}
      {!isPending && (
        <div className="login-admin">
          <div>
            <h2>SHOPTYK</h2>
          </div>
          <Formik
            enableReinitialize
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={adminLoginSchema}
            onSubmit={(data) => {
              onSubmit(data)
            }}
          >
            {({ handleSubmit }) => {
              return (
                <>
                  <form onSubmit={handleSubmit}>
                    <p>
                      <span>Login</span> your account
                    </p>
                    <div className="email">
                      <TextInput
                        name={'email'}
                        label={'Email'}
                        placeholder={'Email'}
                        data-cy="email"
                      />
                      <i className="fas fa-envelope" />
                    </div>
                    <div className="password">
                      <PasswordInput
                        name={'password'}
                        label={'Password'}
                        placeholder={'Password'}
                        data-cy="password"
                      />
                      <i className="fas fa-lock" />
                    </div>
                    <div className="checkbox">
                      <input type="checkbox" id="checkbox" name="checkbox" />
                      <label htmlFor="checkbox">Remember me</label>
                    </div>
                    {!isLogging && <input type="submit" value="Login" className="action" data-cy="submit" />}
                    {isLogging && <LoadingButton/>}
                    
                    {errorMessage && (
                      <div className="login-error" data-cy="global-error">
                        <div className="global-error">{errorMessage}</div>
                      </div>
                    )}
                  </form>
                </>
              )
            }}
          </Formik>
        </div>
      )}
    </>
  )
}

export default Login
