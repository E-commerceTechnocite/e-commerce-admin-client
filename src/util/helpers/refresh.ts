import { useHistory } from "react-router-dom"
import { domain } from "../environnement"
import { http } from "../http"

const refresh = () => {
    console.log("hello update")
    const history = useHistory()
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
        if (error) {
          const keysToRemove = ["token", "refresh"]
          keysToRemove.map((key) => sessionStorage.removeItem(key))
          return history.push("/login")
        }
        const { access_token, refresh_token } = data
        sessionStorage.setItem("token", access_token)
        sessionStorage.setItem("refresh", refresh_token)
        return error
      })
}

export default refresh
