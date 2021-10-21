import * as React from 'react';
import { useHistory, useParams } from "react-router"
import { useEffect, useState } from "react"
import { http } from "../../util/http"
import { config } from "../../index"
import { Formik, Field } from "formik"
import TextInput from "../inputs/TextInput"
import { sendRequest } from "../../util/helpers/refresh"
import { categorySchema } from "../../util/validation/categoryValidation"
import "../users/ActionUser.scss"
import ArrowPrevious from '../previous/ArrowPrevious'
import { CategoryModel } from '../../models/category/category.model';

interface IActionUserProps {}

interface InitialValues {
  label: string
}

const ActionCategory: React.FunctionComponent<IActionUserProps> = () => {
    const history = useHistory()
    //const [myInputValue, setMyInputValue] = useState("")
    const [submitError, setSubmitError] = useState<string>(null)
    const params: { slug: string } = useParams()
    const [initialValues, setInitialValues] = useState<InitialValues>()

    useEffect(() => {
       
    }, [])

    useEffect(() => {
        if (params.slug) {
          //SubmitCurrentTax().then()
        } else {
          setInitialValues({
            label: ""
          })
        }
      }, [params.slug])

    const categoryPostRequest = (data: CategoryModel) => {
        if (params.slug) {
          return http.patch(`${config.api}/v1/product-category/${params.slug}`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          })
        }
        return http.post(`${config.api}/v1/product-category`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
    }

    const submitUserPost = async (data: CategoryModel) => {
      setSubmitError(null)

      let { error } = await sendRequest(categoryPostRequest, data)
      if (error) {
          history.push("/login")
      }
      history.push({
          pathname: "/categories",
          state: { success: true },
      })
    }

    /*const onSubmit = (e: React.FormEvent): void => {
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
      }*/

    return <>
        <ArrowPrevious />          
        <div className="add-user-t">
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={categorySchema}
                onSubmit={(data) => {
                // console.log(data)

                /*if (params.slug) {
                    delete data.taxRuleGroupId
                    delete data.countryId
                }*/
                // console.log(data)
                submitUserPost(data)
             }}
            >
            {({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                  <div className="add-user-title">
                    <label>New Category</label>
                  </div>
                  <TextInput name={"label"} label={"Category"}/>
                  <button type="submit" className="action">Create</button>
                  {submitError && (
                    <div className="global-error">{submitError}</div>
                  )}   
              </form>
             )
            }}
            </Formik>
        </div>         
    </>
};

export default ActionCategory;
