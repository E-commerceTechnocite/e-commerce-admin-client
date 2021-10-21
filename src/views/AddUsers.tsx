import * as React from "react";
import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import { http } from "../util/http";
import { config } from "../index";
import Loading from "../components/loading/Loading";
import { PaginationModel } from "../models/pagination/pagination.model";
import { auth } from "../util/helpers/auth";
import { RoleModel } from "../models/role/role.model";

const AddUsers: React.FunctionComponent = () => {
  const history = useHistory();
  const [roles, setRoles] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    const options = { headers: { ...auth.headers } };
    http
      .get<PaginationModel<RoleModel>>(`${config.api}/v1/role`, options)
      .then(({ data, error }) => {
        setIsPending(true);
        if (!error) {
          setRoles(data.data);
          setRoleId(data.data[0].id);
          setIsPending(false);
        }
      });
  }, []);

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setIsPending(true);
    const body = JSON.stringify({
      email: email,
      username: username,
      roleId: roleId,
    });
    const options = {
      headers: {
        "Content-Type": "application/json",
        ...auth.headers,
      },
    };
    http
      .post<{ access_token: string; refresh_token: string }>(
        `${config.api}/v1/user`,
        body,
        options
      )
      .then(() => history.push("/users"));
  };

  return (
    <>
      {isPending && <Loading />}
      {!isPending && (
        <div className="login-admin">
          <form onSubmit={onSubmit}>
            <p>Add new user</p>
            <div>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Username..."
                required
                onChange={(e) => setUsername(e.target.value)}
              ></input>
            </div>
            <div className="email">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email..."
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <select
                name="selected_role"
                id="selected_role"
                onChange={(e) => setRoleId(e.target.value)}
              >
                {roles.map((item) => {
                  return (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <button type="submit" className="action">
                Soumettre
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddUsers;
