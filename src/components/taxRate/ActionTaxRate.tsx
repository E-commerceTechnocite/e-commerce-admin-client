import { Formik } from 'formik'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { TaxModel } from '../../models/product/tax.model'
import { sendRequest } from '../../util/helpers/refresh'
import { http } from '../../util/http'
import { config } from '../../index'
import Previous from '../previous/Previous'
import './ActionTaxRate.scss'
import { taxRateSchema } from '../../util/validation/taxValidation'
import NumberInput from '../inputs/NumberInput'
import Granted from '../Granted'

interface IActionTaxRateProps {}

const ActionTaxRate: React.FunctionComponent<IActionTaxRateProps> = () => {
  const [initialValues, seInitialValues] = useState({ rate: null })
  const [taxRate, setTaxRate] = useState<TaxModel>()
  const params: { slug: string } = useParams()
  const history = useHistory()

  /**
   * Returns post or patch request for new tax rate
   * @param data
   * @returns request
   */
  const taxRatePostRequest = (data: TaxModel) => {
    if (params.slug) {
      return http.patch(`${config.api}/v1/tax/${params.slug}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      })
    }
    return http.post(`${config.api}/v1/tax`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  }
  /**
   * Submits the post request for new tax rate
   * @param data
   */
  const submitTaxRatePost = async (data: TaxModel) => {
    let { error } = await sendRequest(taxRatePostRequest, data)
    if (error) {
      history.push('/login')
    }
    history.push({
      pathname: '/taxes',
      state: { successRate: true },
    })
  }

  /**
   * Returns get request for tax rate
   * @returns
   */
  const currentTaxRateRequest = () => {
    return http.get<TaxModel>(`${config.api}/v1/tax/${params.slug}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  }
  /**
   * Submits get request for tax rate
   */
  const submitCurrentTaxRate = async () => {
    let { data, error } = await sendRequest(currentTaxRateRequest)
    if (error) {
      history.push('/login')
    }
    setTaxRate(data)
  }

  useEffect(() => {
    if (params.slug) {
      submitCurrentTaxRate().then()
    }
  }, [])
  useEffect(() => {
    if (params.slug) {
      if (taxRate) seInitialValues({ rate: taxRate.rate })
    }
  }, [taxRate])

  return (
    <>
      <Previous />
      <div className="action-tax-rate">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={taxRateSchema}
          onSubmit={(data) => {
            submitTaxRatePost(data)
          }}
        >
          {({ handleSubmit }) => {
            return (
              <>
                <form onSubmit={handleSubmit}>
                  <NumberInput name={'rate'} label={'Rate'} />
                  {!params.slug && (
                    <Granted permissions={['c:tax']}>
                      <button className="action">submit</button>
                    </Granted>
                  )}
                  {params.slug && (
                    <Granted permissions={['u:tax']}>
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

export default ActionTaxRate
