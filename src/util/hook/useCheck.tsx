import { useState, useEffect } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { domain } from "../environnement"
import { http } from "../http"

const useCheckUser = () => {
  const [isPending, setIsPending] = useState(true)
  const location = useLocation()
  const history = useHistory()
  useEffect(() => {
    const controller = new AbortController()
    const token = sessionStorage.getItem("token")
    const options = {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    }
    http
      .get(`${domain}/v1/product?limit=1&page=1`, options)
      .then(({ error }) => {
        if (error) {
          const refresh_token = sessionStorage.getItem("refresh")
          const options = {
            headers: { "Content-Type": "application/json" },
          }
          http
            .post<{ access_token: string; refresh_token: string }>(
              `${domain}/v1/o-auth/refresh`,
              { refresh_token },
              options
            )
            .then(({ data, error }) => {
              if (error) return history.push("/login")
              const { access_token, refresh_token } = data
              sessionStorage.setItem("token", access_token)
              sessionStorage.setItem("refresh", refresh_token)
              setIsPending(false)
            })
        }
        setIsPending(false)
      })
    return () => controller.abort()
  }, [location.pathname])
  return { isPending }
}

export default useCheckUser
