import * as React from 'react';
import { useHistory, useParams } from "react-router"
import { useEffect, useState } from "react"
import { http } from "../../util/http"
import { config } from "../../index"
import Select from "../inputs/Select"
import TextInput from "../inputs/TextInput"
import { PaginationModel } from '../../models/pagination/pagination.model'
import { sendRequest } from "../../util/helpers/refresh"
import { Formik, Field } from "formik"
import { UserModel } from '../../models/user/user.model';
import { userSchema } from "../../util/validation/userValidation"
import "./ActionUser.scss"
import ArrowPrevious from '../previous/ArrowPrevious'


interface IActionUserProps {}

interface InitialValues {
  email: string
  username: string
  roleId: string
}

const ActionUser: React.FunctionComponent<IActionUserProps> = () => {
    const history = useHistory()
    const [roles, setRoles] = useState([])
    const [submitError, setSubmitError] = useState<string>(null)
    const params: { slug: string } = useParams()
    const [initialValues, setInitialValues] = useState<InitialValues>()

    const userPostRequest = (data: UserModel) => {
        if (params.slug) {
          return http.patch(`${config.api}/v1/user/${params.slug}`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          })
        }
        return http.post(`${config.api}/v1/user`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
    }

    const submitUserPost = async (data: UserModel) => {
      setSubmitError(null)

      let { error } = await sendRequest(userPostRequest, data)
      if (error) {
          history.push("/login")
      }
      history.push({
          pathname: "/users",
          state: { success: true },
      })
    }

    const roleRequest = () => {
        return http.get<PaginationModel<any>>(`${config.api}/v1/role`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
    }

    const SubmitRole = async () => {
        let { data, error } = await sendRequest(roleRequest)
        if (error) {
          history.push("/login")
        }
        setRoles(data.data)
    }

    /*useEffect(() => {
        SubmitRole().then()
    }, [roles])*/

    /*const currentTaxRequest = () => {
        return http.get<TaxRuleModel>(`${config.api}/v1/tax-rule/${params.slug}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
      }

    const SubmitCurrentTax = async () => {
        let { data, error } = await sendRequest(currentTaxRequest)
        if (error) {
          history.push("/login")
        }
        setInitialValues({
          email: data.taxRuleGroup.id,
          countryId: data.country.id,
          taxId: data.tax.id,
          zipCode: data.zipCode,
          behavior: 0,
          description: data.description,
        })
      }*/

    useEffect(() => {
      SubmitRole().then()
    }, [])

    useEffect(() => {
        if (params.slug) {
          //SubmitCurrentTax().then()
        } else {
          setInitialValues({
            email: "",
            username: "",
            roleId: "",
          })
        }
      }, [params.slug])

    return <>
        <ArrowPrevious />
        {roles && (          
            <div className="add-user-t">
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={userSchema}
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
                        <label>New user</label>
                      </div>
                      <TextInput name={"username"} label={"Username"}/>                      
                      <TextInput name={"email"} label={"E-mail"}/>
                      <Select name={"roleId"} label={"Role"} options={roles}/>
                      <button type="submit" className="action">Create</button>
                      {submitError && (
                        <div className="global-error">{submitError}</div>
                      )}   
                  </form>
                 )
                }}
                </Formik>
            </div>         
        )}
    </>
};

export default ActionUser;