import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Loading from "../components/loading/Loading";
import { http } from "../util/http";
import { config } from "../index";
import { auth, Permission } from "../util/helpers/auth";
import { sendRequest } from "../util/helpers/refresh";

const Login: React.FunctionComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkbox] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const history = useHistory();

  const fetchPermissions = () =>
    http.get<Permission[]>(`${config.api}/v1/o-auth/permissions`, {
      headers: { ...auth.headers },
    });

  const setPermissions = ({ data, error }) => {
    if (!error) {
      auth.permissions = data;
      return history.push("/");
    }
    setIsPending(false);
  };

  // Check if the user is already logged
  useEffect(() => {
    setIsPending(true);
    if (auth.refresh) {
      sendRequest(fetchPermissions)
        .then(setPermissions)
        .then(() => setIsPending(false));
    } else {
      fetchPermissions()
        .then(setPermissions)
        .then(() => setIsPending(false));
    }
  }, []);

  // Log the user if the credentials exists
  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setIsPending(true);
    const body = { email, password };
    const options = {
      headers: { "Content-Type": "application/json" },
    };
    http
      .post<{ access_token: string; refresh_token: string }>(
        `${config.api}/v1/o-auth/login`,
        body,
        options
      )
      .then(({ data, error }) => {
        const { access_token, refresh_token } = data;
        if (!error) {
          auth.access = access_token;
          auth.refresh = refresh_token;
          sendRequest(fetchPermissions)
            .then(({ data, error }) => {
              auth.permissions = data;
            })
            .then(() => {
              history.push("/");
            });
        } else {
          setIsPending(false);
        }
      });
  };

  return (
    <>
      {isPending && <Loading />}
      {!isPending && (
        <div className="login-admin">
          <div>
            <h2>SHOPTYK</h2>
          </div>
          <form onSubmit={onSubmit}>
            <p>
              <span>Login</span> your account
            </p>
            <div className="email">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                required
                defaultValue={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
              <i className="fas fa-envelope" />
            </div>
            <div className="password">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required
                defaultValue={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
              <i className="fas fa-lock" />
            </div>
            <div className="checkbox">
              <input type="checkbox" id="checkbox" name="checkbox" />
              <label htmlFor="checkbox">Remember me</label>
            </div>
            <input type="submit" value="Login" className="action" />
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
