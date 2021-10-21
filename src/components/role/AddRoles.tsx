import * as React from 'react';
import { useHistory, withRouter } from "react-router"
import { useEffect, useState } from "react"
import { http } from "../../util/http"
import { config } from "../../index"
import { PaginationModel } from '../../models/pagination/pagination.model'
import { sendRequest } from "../../util/helpers/refresh"
import ArrowPrevious from '../previous/ArrowPrevious'

const AddRoles: React.FunctionComponent = () => {
    const history = useHistory()
    const [rolePermissions, setRolePermissions] = useState<string[]>([])
    const [permissions, setPermissions] = useState([])
    //const [isPending, setIsPending] = useState(true)
    const [myInputValue, setMyInputValue] = useState("")
    const perms = {};

    const categoryRequest = () => {
        return http.get<PaginationModel<any>>(`${config.api}/v1/role/permissions`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
    }

    const SubmitCategory = async () => {
        let { data, error } = await sendRequest(categoryRequest)
        if (error) {
          history.push("/login")
        }
        setPermissions(data)
    }

    useEffect(() => {
        SubmitCategory().then()
      }, [])
  
    /*useEffect(() => {
        if (params.slug) {
        //SubmitCurrentTax().then()
        } else {
        setInitialValues({
            email: "",
            username: "",
            roleId: "",
        })
        }
    }, [params.slug])*/

    /*useEffect(() => {
        const token = sessionStorage.getItem("token")
        const options = {
          headers: { Authorization: `Bearer ${token}` },
        }
        http
          .get<[]>(`${config.api}/v1/role/permissions`, options)
          .then(({ data, error }) => {
            setIsPending(true)
            if (!error) {
                setPermissions(data)
                setIsPending(false)
            }
          })
    }, [])*/

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
   
    permissions.forEach(item => {
        let [operation, entity] = item.split(':');
        let name = null
        entity = entity.replace(/-/g, ' ') //replace dash between words with space
        const capitalizeEntity = capitalizeFirstLetter(entity)
        if (!perms[capitalizeEntity]) perms[capitalizeEntity] = []
        switch(operation) {
            case 'r':
                name = "Read"
                break
            case 'c':
                name = "Create"
                break
            case 'u':
                name = "Update"
                break
            case 'd':
                name = "Delete"
                break
            default:
                break
        }
        perms[capitalizeEntity].push({
            value: item,
            title: capitalizeEntity,
            name: name
        });
    });

    const checkboxChange = (e: boolean, value: string) => {
        if(e) setRolePermissions([...rolePermissions, value])
        else setRolePermissions(rolePermissions.filter((item) => item !== value))
    }

    const onSubmit = (e: React.FormEvent): void => {
        e.preventDefault()
        //setIsPending(true)
        const body = JSON.stringify({ name: myInputValue, permissions: rolePermissions })
        const token = sessionStorage.getItem("token")
        const options = {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
        http
          .post<{ access_token: string; refresh_token: string }>(
            `${config.api}/v1/role`,
            body,
            options
          )
          history.push({
            pathname: "/roles",
            state: { success: true },
        })
      }

    return <>
       

       {permissions && ( <>
            <ArrowPrevious/>
            <form onSubmit={onSubmit}>
                <div className="perms-form">
                    <div className="role-name">
                        <div className="role-name-title">
                            <h3>Role name</h3>
                        </div>
                        <div className="role-name-entry">
                            <input type="text" id="name" name="name" placeholder="Type here..." required onChange={e => setMyInputValue(e.target.value)}/>
                        </div>
                    </div>
                    <div className="role-permissions">
                        <div className="role-permissions-title">
                            <h3>Role permissions</h3>
                        </div>
                        <div className="permissions-list">
                        {
                            Object.entries(perms).map(([title, arr], index) => {
                                return (<div className="permissions-choices" key={index}>
                                    <div className="permissions-choices-title"><h4>{title}</h4></div>
                                    <div className="attrs" id="attrs">
                                        {  
                                            Object.values(arr).map((perm, index) => {
                                                return ( <div className="checkBox" key={index}>
                                                    <label>
                                                        <input type="checkbox" id={perm.value} name={perm.value} onChange={(e) => checkboxChange(e.target.checked, perm.value)}></input>
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
                    </div> 
                    <div className="perms-button">
                        <button type="submit" className="action">Submit</button>
                    </div>
                </div>
            </form> </>)}
            </>

};

export default AddRoles;
