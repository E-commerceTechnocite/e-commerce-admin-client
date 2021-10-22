import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { config } from '../../index'
import { http } from '../http'
import { ACCESS_TOKEN_KEY, auth, REFRESH_TOKEN_KEY } from '../helpers/auth'

const useCheckUser = () => {
  const [isPending, setIsPending] = useState(true)
  const location = useLocation()
  const history = useHistory()
  useEffect(() => {
    const controller = new AbortController()
    const options = {
      headers: { ...auth.headers },
      signal: controller.signal,
    }
    http
      .post(`${config.api}/v1/o-auth/check`, null, options)
      .then(({ error }) => {
        if (error) {
          const refresh_token = auth.refresh
          const options = {
            headers: { 'Content-Type': 'application/json' },
          }
          http
            .post<{ access_token: string; refresh_token: string }>(
              `${config.api}/v1/o-auth/refresh`,
              { refresh_token },
              options
            )
            .then(({ data, error }) => {
              if (error) {
                const keysToRemove = [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]
                keysToRemove.map((key) => sessionStorage.removeItem(key))
                return history.push('/login')
              }
              const { access_token, refresh_token } = data
              auth.access = access_token
              auth.refresh = refresh_token
            })
          setIsPending(false)
        }
        setIsPending(false)
      })
    return () => controller.abort()
  }, [location.pathname])
  return { isPending }
}

export default useCheckUser
