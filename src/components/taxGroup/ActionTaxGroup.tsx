import { TaxRuleGroupModel } from '../../models/product/tax-rule-group.model'
import { taxGroupSchema } from '../../util/validation/taxValidation'
import { sendRequest } from '../../util/helpers/refresh'
import { useHistory, useParams } from 'react-router'
import LoadingButton from '../loading/LoadingButton'
import { useQuery } from '../../util/hook/useQuery'
import { auth } from '../../util/helpers/auth'
import param from '../../util/helpers/queries'
import { useEffect, useState } from 'react'
import TextInput from '../inputs/TextInput'
import Previous from '../previous/Previous'
import { http } from '../../util/http'
import { config } from '../../index'
import Granted from '../Granted'
import { Formik } from 'formik'
import * as React from 'react'
import './ActionTaxGroup.scss'

interface IActionTaxGroupProps {}

const ActionTaxGroup: React.FunctionComponent<IActionTaxGroupProps> = () => {
  const [taxRuleGroup, setTaxRuleGroup] = useState<TaxRuleGroupModel>()
  const [initialValues, seInitialValues] = useState({ name: '' })
  const [isSubmit, setIsSubmit] = useState(false)
  const params: { slug: string } = useParams()
  const history = useHistory()
  const query = useQuery()
  const queries = param()

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
            ...auth.headers,
          },
        }
      )
    }
    return http.post(`${config.api}/v1/tax-rule-group`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth.headers,
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
        search: `${queries.page('rule', 1)}${queries.page(
          'group'
        )}${queries.page('country')}${queries.searchOrder(
          'search',
          'order'
        )}${queries.searchOrder(
          'searchGroup',
          'orderGroup'
        )}${queries.searchOrder('searchCountry', 'orderCountry')}${queries.q(
          'q'
        )}${queries.q('qGroup')}${queries.q('qCountry')}`,
        state: { successGroupEdit: true },
      })
    } else {
      history.push({
        pathname: '/taxes',
        search: `${queries.page('rule', 1)}&group=1${queries.page(
          'country'
        )}${queries.searchOrder('search', 'order')}${queries.searchOrder(
          'searchCountry',
          'orderCountry'
        )}${queries.q('q')}${queries.q('qCountry')}`,
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
          ...auth.headers,
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
