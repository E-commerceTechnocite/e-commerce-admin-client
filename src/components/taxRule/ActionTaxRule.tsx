import * as React from 'react'
import { useEffect, useState } from 'react'
import Previous from '../previous/Previous'
import { Formik } from 'formik'
import { useHistory, useParams } from 'react-router'
import { config } from '../../index'
import { http } from '../../util/http'
import { sendRequest } from '../../util/helpers/refresh'
import { CountryModel } from '../../models/product/country.model'
import Select from '../inputs/Select'
import TextInput from '../inputs/TextInput'
import { TaxModel } from '../../models/product/tax.model'
import { TaxRuleGroupModel } from '../../models/product/tax-rule-group.model'
import { taxRuleSchema } from '../../util/validation/taxValidation'
import TextAreaInput from '../inputs/TextAreaInput'
import './ActionTaxRule.scss'
import { TaxRuleModel } from '../../models/product/tax-rule.model'
import Granted from '../Granted'
import NumberInput from '../inputs/NumberInput'
import LoadingButton from '../loading/LoadingButton'
import { useQuery } from '../../util/hook/useQuery'

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
  const [country, setCountry] = useState<CountryModel[]>()
  const [submitError, setSubmitError] = useState<string>(null)
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const history = useHistory()
  const params: { slug: string } = useParams()
  const [initialValues, setInitialValues] = useState<InitialValues>()
  const query = useQuery()

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
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      })
    }
    return http.post(`${config.api}/v1/tax-rule`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
        search: `?rule=${query.get('rule')}&group=${query.get(
          'group'
        )}&country=${query.get('country')}`,
        state: { successEdit: true },
      })
    } else {
      history.push({
        pathname: '/taxes',
        search: `?rule=1&group=${query.get('group')}&country=${query.get(
          'country'
        )}`,
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
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
            {({ handleSubmit}) => {
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
                          <button type="submit" className="action">submit</button>
                        )}{/*  */}
                        {isSubmit && <LoadingButton />}
                      </Granted>
                    )}
                    {params.slug && (
                      <Granted permissions={['u:tax-rule']}>
                        {!isSubmit && (
                          <button type="submit" className="action">submit</button>
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
