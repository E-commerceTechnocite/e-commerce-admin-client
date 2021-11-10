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
import { useQuery } from '../../util/hook/useQuery'
import LoadingButton from '../loading/LoadingButton'

interface IActionTaxGroupProps {}

const ActionTaxGroup: React.FunctionComponent<IActionTaxGroupProps> = () => {
  const [initialValues, seInitialValues] = useState({ name: '' })
  const [taxRuleGroup, setTaxRuleGroup] = useState<TaxRuleGroupModel>()
  const params: { slug: string } = useParams()
  const history = useHistory()
  const query = useQuery()
  const [isSubmit, setIsSubmit] = useState(false)
  const querySearch =
    query.get('search') && query.get('order')
      ? `&search=${query.get('search')}&order=${query.get('order')}`
      : ''
  const queryGroup =
    query.get('searchGroup') && query.get('orderGroup')
      ? `&searchGroup=${query.get('searchGroup')}&orderGroup=${query.get(
          'orderGroup'
        )}`
      : ''
  const queryCountry =
    query.get('searchCountry') && query.get('orderCountry')
      ? `&searchCountry=${query.get('searchCountry')}&orderCountry=${query.get(
          'orderCountry'
        )}`
      : ''

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
    if (query.get('group')) {
      history.push({
        pathname: '/taxes',
        search: `?rule=${query.get('rule')}&group=${query.get(
          'group'
        )}&country=${query.get(
          'country'
        )}${querySearch}${queryGroup}${queryCountry}`,
        state: { successGroupEdit: true },
      })
    } else {
      history.push({
        pathname: '/taxes',
        search: `?rule=${query.get('rule')}&group=1&country=${query.get(
          'country'
        )}${querySearch}${queryCountry}`,
        state: { successGroup: true },
      })
    }
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
            setIsSubmit(true)
            submitTaxGroupPost(data)
          }}
        >
          {({ handleSubmit }) => {
            return (
              <>
                <form onSubmit={handleSubmit}>
                  <div className="add-user-title">
                    {params.slug && <label>Edit tax group</label>}
                    {!params.slug && <label>New tax group</label>}
                  </div>
                  <TextInput name={'name'} label={'Name'} />
                  {!params.slug && (
                    <Granted permissions={['c:tax-rule-group']}>
                      {!isSubmit && <button className="action">submit</button>}
                      {isSubmit && <LoadingButton />}
                    </Granted>
                  )}
                  {params.slug && (
                    <Granted permissions={['u:tax-rule-group']}>
                      {!isSubmit && <button className="action">submit</button>}
                      {isSubmit && <LoadingButton />}
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
