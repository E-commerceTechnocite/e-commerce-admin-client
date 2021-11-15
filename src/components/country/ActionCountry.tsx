import { countrySchema } from '../../util/validation/taxValidation'
import { CountryModel } from '../../models/product/country.model'
import { useHistory, useParams } from 'react-router-dom'
import { sendRequest } from '../../util/helpers/refresh'
import LoadingButton from '../loading/LoadingButton'
import { useQuery } from '../../util/hook/useQuery'
import { auth } from '../../util/helpers/auth'
import param from '../../util/helpers/queries'
import Previous from '../previous/Previous'
import { useEffect, useState } from 'react'
import TextInput from '../inputs/TextInput'
import { http } from '../../util/http'
import { config } from '../../index'
import Granted from '../Granted'
import { Formik } from 'formik'
import * as React from 'react'
import './ActionCountry.scss'

interface IActionCountryProps {}

const ActionCountry: React.FunctionComponent<IActionCountryProps> = () => {
  const [initialValues, seInitialValues] = useState({ name: '', code: '' })
  const [country, setCountry] = useState<CountryModel>()
  const [isSubmit, setIsSubmit] = useState(false)
  const params: { slug: string } = useParams()
  const history = useHistory()
  const query = useQuery()
  const queries = param()

  /**
   * Returns post or patch request for new country
   * @param data
   * @returns request
   */
  const countryPostRequest = (data: CountryModel) => {
    if (params.slug) {
      return http.patch(`${config.api}/v1/country/${params.slug}`, data, {
        headers: {
          'Content-Type': 'application/json',
          ...auth.headers,
        },
      })
    }
    return http.post(`${config.api}/v1/country`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth.headers,
      },
    })
  }
  /**
   * Submits the post request for new country
   * @param data
   */
  const submitCountry = async (data: CountryModel) => {
    let { error } = await sendRequest(countryPostRequest, data)
    if (error) {
      history.push('/login')
    }
    if (query.get('country')) {
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
        )}${queries.q('q')}${queries.q('qGroup')}`,
        state: { successCountryEdit: true },
      })
    } else {
      history.push({
        pathname: '/taxes',
        search: `${queries.page('rule', 1)}${queries.page(
          'group'
        )}&country=1${queries.searchOrder(
          'search',
          'order'
        )}${queries.searchOrder('searchGroup', 'orderGroup')}${queries.q(
          'q'
        )}${queries.q('qGroup')}`,
        state: { successCountry: true },
      })
    }
  }

  /**
   * Returns get request for country
   * @returns
   */
  const currentCountryRequest = () => {
    return http.get<CountryModel>(`${config.api}/v1/country/${params.slug}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  }
  /**
   * Submits get request for country
   */
  const submitCurrentCountry = async () => {
    let { data, error } = await sendRequest(currentCountryRequest)
    if (error) {
      history.push('/login')
    }
    setCountry(data)
  }

  useEffect(() => {
    if (params.slug) {
      submitCurrentCountry().then()
    }
  }, [params.slug])
  useEffect(() => {
    if (params.slug) {
      if (country) {
        seInitialValues({ name: country.name, code: country.code })
      }
    }
  }, [country])

  return (
    <>
      <Previous />
      <div className="action-tax-country">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={countrySchema}
          onSubmit={(data) => {
            setIsSubmit(true)
            submitCountry(data)
          }}
        >
          {({ handleSubmit }) => {
            return (
              <>
                <form onSubmit={handleSubmit}>
                  <TextInput name={'name'} label={'Name'} />
                  <TextInput name={'code'} label={'Code'} />
                  {!params.slug && (
                    <Granted permissions={['c:country']}>
                      {!isSubmit && <button className="action">submit</button>}
                      {isSubmit && <LoadingButton />}
                    </Granted>
                  )}
                  {params.slug && (
                    <Granted permissions={['u:country']}>
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

export default ActionCountry
