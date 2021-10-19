import * as React from "react"
import Previous from "../previous/Previous"
import { Formik, Field } from "formik"
import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { config } from "../../index"
import { http } from "../../util/http"
import { sendRequest } from "../../util/helpers/refresh"
import { PaginationModel } from "../../models/pagination/pagination.model"
import { CountryModel } from "../../models/product/country.model"
import Select from "../inputs/Select"
import TextInput from "../inputs/TextInput"
import { TaxModel } from "../../models/product/tax.model"
import { TaxRuleGroupModel } from "../../models/product/tax-rule-group.model"
import { taxRuleSchema } from "../../util/validation/taxValidation"
import TextAreaInput from "../inputs/TextAreaInput"
import "./ActionTaxRule.scss"
import { TaxRuleModel } from "../../models/product/tax-rule.model"

interface IActionTaxRuleProps {}

const ActionTaxRule: React.FunctionComponent<IActionTaxRuleProps> = (props) => {
  const [taxRuleGroup, setTaxRuleGroup] = useState<TaxRuleGroupModel[]>()
  const [tax, setTax] = useState<TaxModel[]>()
  const [country, setCountry] = useState<CountryModel[]>()
  const history = useHistory()

  // Post request for tax rule
  const taxRulePostRequest = (data: TaxRuleModel) => {
    return http.post(
      `${config.api}/tax-rule`, data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
  }
  const submitTaxRulePost = async (data: TaxRuleModel) => {
    let { error } = await sendRequest(taxRulePostRequest, data)
    if (error) {
      history.push("/login")
    }
    history.push({
      pathname: "/taxes",
      state: { success: true },
    })
  }

  // Get request for tax rate
  const taxRuleGroupRequest = () => {
    return http.get<PaginationModel<TaxRuleGroupModel>>(
      `${config.api}/v1/tax-rule-group`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
  }
  const SubmittaxRuleGroup = async () => {
    let { data, error } = await sendRequest(taxRuleGroupRequest)
    if (error) {
      history.push("/login")
    }
    setTaxRuleGroup(data.data)
  }

  // Get request for tax rate
  const taxRequest = () => {
    return http.get<PaginationModel<TaxModel>>(`${config.api}/v1/tax`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
  }
  const SubmitTax = async () => {
    let { data, error } = await sendRequest(taxRequest)
    if (error) {
      history.push("/login")
    }
    setTax(data.data)
  }

  // Get request for country
  const countryRequest = () => {
    return http.get<PaginationModel<CountryModel>>(`${config.api}/v1/country`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
  }
  const SubmitCountry = async () => {
    let { data, error } = await sendRequest(countryRequest)
    if (error) {
      history.push("/login")
    }
    setCountry(data.data)
  }

  useEffect(() => {
    SubmitCountry().then()
    SubmitTax().then()
    SubmittaxRuleGroup().then()
  }, [])
  return (
    <>
      <Previous />

      {country && tax && taxRuleGroup && (
        <div className="action-tax-rule">
          <Formik
            initialValues={{
              taxRuleGroupId: "",
              countryId: "",
              taxId: "",
              zipCode: "",
              behavior: 0,
              description: "",
            }}
            validationSchema={taxRuleSchema}
            onSubmit={(data) => {
              submitTaxRulePost(data)
            }}
          >
            {({ handleSubmit }) => {
              return (
                <>
                  <form onSubmit={handleSubmit}>
                    <Select
                      name={"countryId"}
                      label={"Country"}
                      options={country}
                    />
                    <Select name={"taxId"} label={"Tax"} options={tax} />
                    <Select
                      name={"taxRuleGroupId"}
                      label={"Tax Group"}
                      options={taxRuleGroup}
                    />
                    <TextInput name={"zipCode"} label={"Zip Code"} />
                    <TextAreaInput name={"description"} label={"Description"} />
                    <button className="action">submit</button>
                  </form>
                </>
              )
            }}
          </Formik>
        </div>
      )}
    </>
  )
}

export default ActionTaxRule
