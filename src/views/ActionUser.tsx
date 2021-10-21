import * as React from 'react';
import { useHistory, useParams } from "react-router"
import { useEffect, useState } from "react"
import { http } from "../util/http"
import { config } from "../index"
import Select from "../components/inputs/Select"
import TextInput from "../components/inputs/TextInput"
import Loading from "../components/loading/Loading"
import { PaginationModel } from '../models/pagination/pagination.model'
import { sendRequest } from "../util/helpers/refresh"
import { Formik, Field } from "formik"
import { UserModel } from '../models/user/user.model';
import { userSchema } from "../util/validation/userValidation"

interface IActionUserProps {}

interface InitialValues {
  email: string
  username: string
  roleId: string
}

const ActionUser: React.FunctionComponent<IActionUserProps> = () => {
    const history = useHistory()
    const [roles, setRoles] = useState([])
    //const [isPending, setIsPending] = useState(true)
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [roleId, setRoleId] = useState("")
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
        setRoleId(data.data[0].id)
        //setIsPending(false)
      }

    useEffect(() => {
        SubmitRole().then()
    }, [])

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

    /*useEffect(() => {
        const token = sessionStorage.getItem("token")
        const options = {
          headers: { Authorization: `Bearer ${token}` },
        }
        http
          .get<PaginationModel<any>>(`${config.api}/v1/role`, options)
          .then(({ data, error }) => {
            setIsPending(true)
            if (!error) {
                setRoles(data.data)
                setRoleId(data.data[0].id)
                setIsPending(false)
            }
          })
    }, [])*/

    /*const onSubmit = (e: React.FormEvent): void => {
        e.preventDefault()
        setIsPending(true)
        const body = JSON.stringify({ email: email, username: username, roleId: roleId })
        const token = sessionStorage.getItem("token")
        const options = {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
        http
          .post<{ access_token: string; refresh_token: string }>(
            `${config.api}/v1/user`,
            body,
            options
          )
          history.push("/users")
      }*/

    return <>
        
        {roles && (
            <div className="add-user">
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
                <>
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
                </> )
                }}
                </Formik>
            </div>
        )}
    </>
};

export default ActionUser;