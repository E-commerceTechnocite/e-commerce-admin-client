import * as React from "react"
import { useEffect, useState } from "react"
import { useHistory, withRouter } from "react-router"
import Loading from "../components/Loading"
import { http } from "../util/http"

interface ILoginProps {}

const Login: React.FunctionComponent<ILoginProps> = (props) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [checkbox] = useState(false)
  const [isPending, setIsPending] = useState(true)
  const history = useHistory()

  useEffect(() => {
    const token = sessionStorage.getItem("token")
    const options = {
      headers: { Authorization: `Bearer ${token}` },
    }
    http
      .get("http://localhost:3000/v1/product?limit=1&page=1", options)
      .then(({ error }) => {
        if (!error) {
          return history.push("/")
        }
        setIsPending(false)
      })
  }, [])

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    setIsPending(true)
    console.log({ email, password, checkbox })
    const body = { email, password }
    const options = {
      headers: { "Content-Type": "application/json" },
    }
    http
      .post<{ access_token: string; refresh_token: string }>(
        "http://localhost:3000/v1/o-auth/login",
        body,
        options
      )
      .then(({ data, error }) => {
        const { access_token, refresh_token } = data
        if (!error) {
          sessionStorage.setItem("token", access_token)
          sessionStorage.setItem("refresh", refresh_token)
          history.push("/")
        } else {
          console.error(error.message)
        }
      })
  }

  return (
    <>
      {isPending && <Loading />}
      {!isPending && (
        <div className="login-admin">
          <div>
            <h1>LOGO</h1>
            <h2>Sign in to WNDR</h2>
          </div>
          <div>
            <form onSubmit={onSubmit}>
              <div className="email">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  defaultValue={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>
              <div className="password">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  defaultValue={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />
              </div>
              <div className="checkbox">
                <input type="checkbox" id="checkbox" name="checkbox" />
                <label htmlFor="checkbox">Remember me</label>
              </div>
              <input type="submit" value="Sign in" className="action" />
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Login
