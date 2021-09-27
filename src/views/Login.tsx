import * as React from "react"
import { http, HttpServerSideException } from "../util/http"

interface ILoginProps {}

const Login: React.FunctionComponent<ILoginProps> = (props) => {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [checkbox, setCheckbox] = React.useState(false)

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    console.log({ email, password, checkbox })
    const body = { email, password }
    const options = {
      headers: { "Content-Type": "application/json" },
    }
    http
      .post<{access_token, refresh_token}>("http://localhost:3000/v1/o-auth/login", body, options)
      .then(({data, error}) => {
        if (!error) {
          // sessionStorage.setItem('token', )
        }
      })
  }

  return (
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
          <input type="submit" value="login" className="action" />
        </form>
      </div>
    </div>
  )
}

export default Login
