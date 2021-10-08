import * as React from 'react';
import { useHistory, withRouter } from "react-router"
import { useEffect, useState } from "react"
import { http } from "../util/http"
import { domain } from "../util/environnement"
import Loading from "../components/loading/Loading"

const AddRoles: React.FunctionComponent = () => {
    const history = useHistory()
    //const [role, setRole] = useState([])
    const [permissions, setPermissions] = useState([])
    const [isPending, setIsPending] = useState(true)
    const [myInputValue, setMyInputValue] = useState("")
    const selectedPermissionsArray = []
    const perms = {};

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
   
    permissions.forEach(item => {
        const [operation, entity] = item.split(':');
        let name = null
        if (!perms[entity]) perms[entity] = []
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

    const checkboxChange = (event: boolean, value) => {
        const myIndex = selectedPermissionsArray.indexOf(value)
        if(event) {
            if(myIndex === -1) {
                selectedPermissionsArray.push(value)
            }    
        } else {
            if (myIndex !== -1) {
                selectedPermissionsArray.splice(myIndex, 1)
            }
        }
    }

    const onSubmit = (e: React.FormEvent): void => {
        e.preventDefault()
        setIsPending(true)
        const body = JSON.stringify({ name: myInputValue, permissions: selectedPermissionsArray })
        const token = sessionStorage.getItem("token")
        const options = {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
        http
          .post<{ access_token: string; refresh_token: string }>(
            `${domain}/v1/role`,
            body,
            options
          )
          history.push("/roles")
      }

    return <>
        {isPending && <Loading />}
        {!isPending && (
            <form onSubmit={onSubmit}>
                <div>
                    <label>Role's name</label>
                    <br/>
                    <input type="text" id="name" name="name" placeholder="Enter the name here..." required onChange={e => setMyInputValue(e.target.value)}></input>
                    <div className="AddWrap">
                    {
                        Object.entries(perms).map(([title, arr], index) => {
                            return (<div key={index}>
                                <h3>{title}</h3>
                                <div className="attrs" id="attrs">
                                    {  
                                        Object.values(arr).map((perm, index) => {
                                            return ( <div className="checkBox" key={index}>
                                                <label>
                                                    <input type="checkbox" id={perm.value} name={perm.value} onChange={(event) => checkboxChange(event.target.checked, perm.value)}></input>
                                                    {perm.name}
                                                </label>
                                            </div>)
                                        }) 
                                    }
                                </div>
                            </div>
                            )
                        })
                    }
                    </div> 
                    <div>
                        <button type="submit" className="action">Soumettre</button>
                    </div>
                </div>
            </form>
        )}
    </>
};

export default AddRoles;
