import { Formik } from "formik"
import * as React from "react"
import { useState } from "react"
import { useHistory } from "react-router"
import { TaxRuleGroupModel } from "../../models/product/tax-rule-group.model"
import { sendRequest } from "../../util/helpers/refresh"
import { http } from "../../util/http"
import { taxGroupSchema } from "../../util/validation/taxValidation"
import TextInput from "../inputs/TextInput"
import Previous from "../previous/Previous"
import "./ActionTaxGroup.scss"
import { config } from "../../index"

interface IActionTaxGroupProps {}

const ActionTaxGroup: React.FunctionComponent<IActionTaxGroupProps> = () => {
  const [initialValues, seInitialValues] = useState({ name: "" })
  const history = useHistory()

    // Post request for tax rule
    const taxGroupPostRequest = (data: TaxRuleGroupModel) => {
      return http.post(`${config.api}/v1/tax-rule-group`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
    }
    const submitTaxGroupPost = async (data: TaxRuleGroupModel) => {
      let { error } = await sendRequest(taxGroupPostRequest, data)
      if (error) {
        history.push("/login")
      }
      history.push({
        pathname: "/taxes",
        state: { successGroup: true },
      })
    }

  return (
    <>
      <Previous />
      <div className="action-tax-group">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={taxGroupSchema}
          onSubmit={(data) => {
            submitTaxGroupPost(data)
          }}
        >
          {({ handleSubmit }) => {
            return (
              <>
                <form onSubmit={handleSubmit}>
                  <TextInput name={"name"} label={"Name"} />
                  <button className="action">submit</button>
                  {/* {submitError && (
                  <div className="global-error">{submitError}</div>
                )} */}
                </form>
              </>
            )
          }}
        </Formik>
      </div>
    </>
  )
}

export default ActionTaxGroup
