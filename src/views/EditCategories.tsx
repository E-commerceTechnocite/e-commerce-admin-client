import * as React from 'react';
import { useHistory, withRouter } from "react-router"
import { useEffect, useState } from "react"
import { http } from "../util/http"
import { useParams } from "react-router"
import { config } from "../index"

const EditCategories: React.FunctionComponent = () => {
    const history = useHistory()
    const [myInputValue, setMyInputValue] = useState("")
    const params: { slug: string } = useParams()

    useEffect(() => {
       
    }, [])

    const onSubmit = (e: React.FormEvent): void => {
        e.preventDefault()
        const body = JSON.stringify({ label: myInputValue })
        const token = sessionStorage.getItem("token")
        const options = {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
        http.patch(`${config.api}/v1/product-category/${params.slug}`,
            body,
            options
          )
          history.push("/categories")
      }

    return <>
        <form onSubmit={onSubmit}>
            <div>
                <label>Category's name edit</label>
                <br/>
                <input type="text" id="name" name="name" placeholder="Enter category edit here..." required onChange={e => setMyInputValue(e.target.value)}></input>
                <div>
                    <button type="submit" className="action">Submit</button>
                </div>
            </div>
        </form>
    </>
};

export default EditCategories;
