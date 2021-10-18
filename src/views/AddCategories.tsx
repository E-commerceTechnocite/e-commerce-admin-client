import * as React from 'react';
import { useHistory, withRouter } from "react-router"
import { useEffect, useState } from "react"
import { http } from "../util/http"
import { config } from "../index"

const AddCategories: React.FunctionComponent = () => {
    const history = useHistory()
    const [myInputValue, setMyInputValue] = useState("")

    useEffect(() => {
       
    }, [])

    const onSubmit = (e: React.FormEvent): void => {
        e.preventDefault()
        const body = JSON.stringify({ label: myInputValue })
        const token = sessionStorage.getItem("token")
        const options = {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
        http
          .post<{ access_token: string; refresh_token: string }>(
            `${config.api}/v1/product-category`,
            body,
            options
          )
          history.push("/categories")
      }

    return <>
        <form onSubmit={onSubmit}>
            <div>
                <label>Category's name</label>
                <br/>
                <input type="text" id="name" name="name" placeholder="Enter category here..." required onChange={e => setMyInputValue(e.target.value)}></input>
                <div>
                    <button type="submit" className="action">Submit</button>
                </div>
            </div>
        </form>
    </>
};

export default AddCategories;
