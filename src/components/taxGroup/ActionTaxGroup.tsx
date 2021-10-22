import { Formik } from 'formik'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { TaxRuleGroupModel } from '../../models/product/tax-rule-group.model'
import { sendRequest } from '../../util/helpers/refresh'
import { http } from '../../util/http'
import { taxGroupSchema } from '../../util/validation/taxValidation'
import TextInput from '../inputs/TextInput'
import Previous from '../previous/Previous'
import './ActionTaxGroup.scss'
import { config } from '../../index'
import Granted from '../Granted'

interface IActionTaxGroupProps {}

const ActionTaxGroup: React.FunctionComponent<IActionTaxGroupProps> = () => {
  const [initialValues, seInitialValues] = useState({ name: '' })
  const [taxRuleGroup, setTaxRuleGroup] = useState<TaxRuleGroupModel>()
  const params: { slug: string } = useParams()
  const history = useHistory()

  /**
   * Returns post or patch request for new tax group
   * @param data
   * @returns request
   */
  const taxGroupPostRequest = (data: TaxRuleGroupModel) => {
    if (params.slug) {
      return http.patch(
        `${config.api}/v1/tax-rule-group/${params.slug}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      )
    }
    return http.post(`${config.api}/v1/tax-rule-group`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  }
  /**
   * Submits the post request for new tax group
   * @param data
   */
  const submitTaxGroupPost = async (data: TaxRuleGroupModel) => {
    let { error } = await sendRequest(taxGroupPostRequest, data)
    if (error) {
      history.push('/login')
    }
    history.push({
      pathname: '/taxes',
      state: { successGroup: true },
    })
  }

  /**
   * Returns get request for tax group
   * @returns
   */
  const currentTaxRuleGroupRequest = () => {
    return http.get<TaxRuleGroupModel>(
      `${config.api}/v1/tax-rule-group/${params.slug}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }
    )
  }
  /**
   * Submits get request for tax group
   */
  const submitCurrentTaxRuleGroup = async () => {
    let { data, error } = await sendRequest(currentTaxRuleGroupRequest)
    if (error) {
      history.push('/login')
    }
    setTaxRuleGroup(data)
  }

  useEffect(() => {
    if (params.slug) {
      submitCurrentTaxRuleGroup().then()
    }
  }, [])
  useEffect(() => {
    if (params.slug) {
      if (taxRuleGroup) seInitialValues({ name: taxRuleGroup.name })
    }
  }, [taxRuleGroup])

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
                  <TextInput name={'name'} label={'Name'} />
                  {!params.slug && (
                    <Granted permissions={['c:tax-rule-group']}>
                      <button className="action">submit</button>
                    </Granted>
                  )}
                  {params.slug && (
                    <Granted permissions={['u:tax-rule-group']}>
                      <button className="action">submit</button>
                    </Granted>
                  )}

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
