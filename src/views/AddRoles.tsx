import * as React from 'react';
import { useHistory, withRouter } from "react-router"
import { useEffect, useState } from "react"
import { http } from "../util/http"
import { domain } from "../util/environnement"
import Loading from "../components/loading/Loading"

const AddRoles: React.FunctionComponent = () => {
    const history = useHistory()
    const [role, setRole] = useState("")
    const [permissions, setPermissions] = useState([])
    const [isPending, setIsPending] = useState(true)

    useEffect(() => {
        const token = sessionStorage.getItem("token")
        const options = {
          headers: { Authorization: `Bearer ${token}` },
        }
        http
          .get<[]>(`${domain}/v1/role/permissions`, options)
          .then(({ data,error }) => {
            setIsPending(true)
            if (!error) {
                setPermissions(data)
                setIsPending(false)
            }
          })
    }, [])

    const perms = {};
    permissions.forEach(item => {
        const [operation, entity] = item.split(':');
        if (!perms[entity]) perms[entity] = []
        let name = null
        switch(operation) {
            case 'r':
                name = "read"
                break
            case 'c':
                name = "create"
                break
            case 'u':
                name = "update"
                break
            case 'd':
                name = "delete"
                break
            default:
                break
        }
        perms[entity].push({
            value: item,
            title: entity,
            name: name
        });
    });

    const onSubmit = (e: React.FormEvent): void => {
        e.preventDefault()
        setIsPending(true)
        //console.log({ email, password, checkbox })
        //document.getElementById('attrs')
        const body = { role }
        const options = {
          headers: { "Content-Type": "application/json" },
        }
        http
          .post<{ access_token: string; refresh_token: string }>(
            `${domain}/v1/role`,
            body,
            options
          )
      }

    return <>
    {isPending && <Loading />}
    {!isPending && (
    <form onSubmit={onSubmit}>
        <div>
            <label>Role's name</label>
            <br/>
            <input type="text" id="name" name="name" required></input>
            <div className="AddWrap">
            {
                Object.entries(perms).map(([title, arr]) => {
                    return (<>
                    <h3>{title}</h3>
                    <div className="attrs" id="attrs">
                        {  
                        Object.values(arr).map((perm) => {
                            return ( <div className="checkBox">
                                    <input type="checkbox" id={perm.value} name={perm.value}></input>
                                    <label>{perm.name}</label>
                            </div>)
                        }) 
                        }
                    </div>
                    </>
                    )
                })
            }
            </div> 
            <div>
                <button type="submit" className="action">Soumettre</button>
            </div>
        </div>
    </form>)}
    </>
    };

export default AddRoles;
