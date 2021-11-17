import { TaxRuleGroupModel } from '../../models/product/tax-rule-group.model'
import { taxRuleSchema } from '../../util/validation/taxValidation'
import { TaxRuleModel } from '../../models/product/tax-rule.model'
import { CountryModel } from '../../models/product/country.model'
import param from '../../util/helpers/queries'
import { sendRequest } from '../../util/helpers/refresh'
import { useHistory, useParams } from 'react-router'
import LoadingButton from '../loading/LoadingButton'
import TextAreaInput from '../inputs/TextAreaInput'
import { useQuery } from '../../util/hook/useQuery'
import NumberInput from '../inputs/NumberInput'
import { auth } from '../../util/helpers/auth'
import Previous from '../previous/Previous'
import { useEffect, useState } from 'react'
import TextInput from '../inputs/TextInput'
import { http } from '../../util/http'
import Select from '../inputs/Select'
import { config } from '../../index'
import Granted from '../Granted'
import { Formik } from 'formik'
import * as React from 'react'
import './ActionTaxRule.scss'

interface IActionTaxRuleProps {}

interface InitialValues {
  taxRuleGroupId?: string
  countryId: string
  tax: number
  zipCode: string
  behavior: number
  description: string
}

const ActionTaxRule: React.FunctionComponent<IActionTaxRuleProps> = () => {
  const [taxRuleGroup, setTaxRuleGroup] = useState<TaxRuleGroupModel[]>()
  const [initialValues, setInitialValues] = useState<InitialValues>()
  const [submitError, setSubmitError] = useState<string>(null)
  const [country, setCountry] = useState<CountryModel[]>()
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const params: { slug: string } = useParams()
  const history = useHistory()
  const query = useQuery()
  const queries = param()

  /**
   * Returns post or patch request for new tax rule
   * @param data
   * @returns request
   */
  const taxRulePostRequest = (data: TaxRuleModel) => {
    if (params.slug) {
      return http.patch(`${config.api}/v1/tax-rule/${params.slug}`, data, {
        headers: {
          'Content-Type': 'application/json',
          ...auth.headers,
        },
      })
    }
    return http.post(`${config.api}/v1/tax-rule`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth.headers,
      },
    })
  }
  /**
   * Submits the post request for new tax rue
   * @param data
   */
  const submitTaxRulePost = async (data: TaxRuleModel) => {
    setSubmitError(null)

    let { error } = await sendRequest(taxRulePostRequest, data)
    if (error) {
      if (error.statusCode === 400) {
        setSubmitError(
          'This tax rule already exists, change tax group or country.'
        )
        setIsSubmit(false)
        return
      }
      history.push('/login')
    }
    if (query.get('rule')) {
      history.push({
        pathname: '/taxes',
        search: `${queries.page('rule', 1)}${queries.page(
          'group'
        )}${queries.page('country')}&s=u${queries.searchOrder(
          'search',
          'order'
        )}${queries.searchOrder(
          'searchGroup',
          'orderGroup'
        )}${queries.searchOrder('searchCountry', 'orderCountry')}${queries.q(
          'q'
        )}${queries.q('qGroup')}${queries.q('qCountry')}`,
        state: { successEdit: true },
      })
    } else {
      history.push({
        pathname: '/taxes',
        search: `?rule=1${queries.page('group')}${queries.page(
          'country'
        )}&s=u${queries.searchOrder(
          'searchGroup',
          'orderGroup'
        )}${queries.searchOrder('searchCountry', 'orderCountry')}${queries.q(
          'qGroup'
        )}${queries.q('qCountry')}`,
        state: { success: true },
      })
    }
  }

  /**
   * Returns get request for tax group
   * @returns
   */
  const taxRuleGroupRequest = () => {
    return http.get<TaxRuleGroupModel[]>(
      `${config.api}/v1/tax-rule-group/all`,
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
  const submitTaxRuleGroup = async () => {
    let { data, error } = await sendRequest(taxRuleGroupRequest)
    if (error) {
      history.push('/login')
    }
    setTaxRuleGroup(data)
  }

  /**
   * Returns get request for country
   * @returns
   */
  const countryRequest = () => {
    return http.get<CountryModel[]>(`${config.api}/v1/country/all`, {
      headers: {
        ...auth.headers,
      },
    })
  }
  /**
   * Submits get request for country
   */
  const submitCountry = async () => {
    let { data, error } = await sendRequest(countryRequest)
    if (error) {
      history.push('/login')
    }
    setCountry(data)
  }

  useEffect(() => {
    submitCountry().then()
    submitTaxRuleGroup().then()
  }, [])

  const currentTaxRequest = () => {
    return http.get<TaxRuleModel>(`${config.api}/v1/tax-rule/${params.slug}`, {
      headers: {
        ...auth.headers,
      },
    })
  }
  const SubmitCurrentTax = async () => {
    let { data, error } = await sendRequest(currentTaxRequest)
    if (error) {
      history.push('/login')
    }
    setInitialValues({
      taxRuleGroupId: data.taxRuleGroup.id,
      countryId: data.country.id,
      tax: data.tax ? data.tax : 0,
      zipCode: data.zipCode,
      behavior: 0,
      description: data.description,
    })
  }

  useEffect(() => {
    if (params.slug) {
      SubmitCurrentTax().then()
    } else {
      setInitialValues({
        taxRuleGroupId: '',
        countryId: '',
        tax: 0,
        zipCode: '',
        behavior: 0,
        description: '',
      })
    }
  }, [params.slug])

  return (
    <>
      <Previous />
      {country && taxRuleGroup && (
        <div className="action-tax-rule">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={taxRuleSchema}
            onSubmit={(data) => {
              setIsSubmit(true)
              if (params.slug) {
                delete data.taxRuleGroupId
                delete data.countryId
              }
              submitTaxRulePost(data)
            }}
          >
            {({ handleSubmit }) => {
              return (
                <>
                  <form onSubmit={handleSubmit}>
                    <div className="add-user-title">
                      {params.slug && <label>Edit tax rule</label>}
                      {!params.slug && <label>New tax rule</label>}
                    </div>
                    {!params.slug && (
                      <Select
                        name={'countryId'}
                        label={'Country'}
                        options={country}
                      />
                    )}
                    {!params.slug && (
                      <Select
                        name={'taxRuleGroupId'}
                        label={'Tax Group'}
                        options={taxRuleGroup}
                      />
                    )}
                    <NumberInput name="tax" label={'Tax %'} />
                    <TextInput name={'zipCode'} label={'Zip Code'} />
                    <TextAreaInput name={'description'} label={'Description'} />
                    {!params.slug && (
                      <Granted permissions={['c:tax-rule']}>
                        {!isSubmit && (
                          <button type="submit" className="action">
                            submit
                          </button>
                        )}
                        {/*  */}
                        {isSubmit && <LoadingButton />}
                      </Granted>
                    )}
                    {params.slug && (
                      <Granted permissions={['u:tax-rule']}>
                        {!isSubmit && (
                          <button type="submit" className="action">
                            submit
                          </button>
                        )}
                        {isSubmit && <LoadingButton />}
                      </Granted>
                    )}
                    {submitError && (
                      <div className="global-error">{submitError}</div>
                    )}
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
