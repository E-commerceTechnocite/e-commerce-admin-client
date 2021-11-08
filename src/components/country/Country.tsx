import * as React from 'react'
import { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import { CountryModel } from '../../models/product/country.model'
import { http } from '../../util/http'
import { config } from '../../index'
import { sendRequest } from '../../util/helpers/refresh'
import Pagination from '../pagination/Pagination'
import { motion } from 'framer-motion'
import './Country.scss'
import Granted from '../Granted'
import { auth } from '../../util/helpers/auth'
import { TaxRuleModel } from '../../models/product/tax-rule.model'
import CountrySkeleton from './skeleton/CountrySkeleton'
import { useQuery } from '../../util/hook/useQuery'

interface ICountryProps {
  successCountry?: boolean | undefined
  successCountryEdit?: boolean | undefined
  countryToParent?: () => void
}

interface DeleteCountry {
  entityType: string
  taxRules: {
    id: string
  }[]
}

const Country: React.FunctionComponent<ICountryProps> = ({
  successCountry,
  successCountryEdit,
  countryToParent,
}) => {
  const [page, setPage] = useState<number>(1)
  const [country, setCountry] = useState<CountryModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [taxRulesDeleted, setTaxRulesDeleted] = useState<TaxRuleModel[]>()
  const [refreshPage, setRefreshPage] = useState(false)
  const [isDeleted, setIsDeleted] = useState<boolean>(false)
  const [toast, setToast] = useState<boolean>(false)
  const [toastEdit, setToastEdit] = useState<boolean>(false)
  const history = useHistory()
  const query = useQuery()

  /**
   * Returns the get request for country
   * @returns request
   */
  const countryRequest = () => {
    return http.get<PaginationModel<CountryModel>>(
      `${config.api}/v1/country?page=${query.get('country')}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }
    )
  }
  /**
   * Submits the get request for country and sets the state values from response
   */
  const submitCountry = async () => {
    let { data, error } = await sendRequest(countryRequest)
    if (error) {
      if (error.statusCode === 404) {
        history.push('/not-found')
        return
      }
      history.push('/login')
    }
    setCountry(data.data)
    setMeta(data.meta)
  }

  /**
   * Returns delete request of selected Country
   * @param id: string
   * @returns: request
   */
  const deleteCountryRequest = (id: string) => {
    return http.delete<DeleteCountry>(`${config.api}/v1/country/${id}`, null, {
      headers: { ...auth.headers },
    })
  }
  /**
   * Submits delete request of selected country
   * @param id: string
   * @param rate: number
   */
  const submitDeleteCountry = async (id: string, name: string) => {
    if (
      confirm(
        `Delete country: ${name}%? \nAll tax rules related will be deleted.`
      )
    ) {
      let { data, error } = await sendRequest(deleteCountryRequest, id)
      if (error) {
        history.push('/login')
        return
      }
      setTaxRulesDeleted(data[0].taxRules)
      setRefreshPage(!refreshPage)
      setIsDeleted(true)
      countryToParent()
    }
  }

  /**
   * Close the delete message
   */
  const onClickClose = () => {
    setIsDeleted(false)
    setTimeout(() => {
      setTaxRulesDeleted(null)
    }, 1000)
  }

  useEffect(() => {
    if (!query.get('country')) {
      history.push('/taxes?rule=1&group=1&country=1&s=u')
      return
    }
    submitCountry().then()
  }, [refreshPage, query.get('country')])

  // Check if a country has been added and sends a confirmation toast
  useEffect(() => {
    if (successCountry === true) {
      setToast(true)
      setTimeout(() => {
        setToast(false)
      }, 10000)
    }
    if (successCountryEdit === true) {
      setToastEdit(true)
      setTimeout(() => {
        setToastEdit(false)
      }, 10000)
    }
  }, [successCountry, successCountryEdit])

  // Hide delete confirmation message  after 10 seconds
  useEffect(() => {
    if (isDeleted) {
      setTimeout(() => {
        setIsDeleted(false)
      }, 10000)
      setTimeout(() => {
        setTaxRulesDeleted(null)
      }, 11000)
    }
  }, [isDeleted])

  return (
    <>
      {!country && !meta && <CountrySkeleton />}
      {country && meta && (
        <div className="country">
          <div className="top">
            <div className="search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search..." />
            </div>
            <Granted permissions={['c:country']}>
              <Link
                to={`/taxes/add-country?rule=${query.get(
                  'rule'
                )}&group=${query.get('group')}`}
                className="action"
              >
                New country
              </Link>
            </Granted>
            {successCountry && (
              <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
                {' '}
                <i className="fas fa-check" />
                Country Added
                <i className="fas fa-times" onClick={() => setToast(false)} />
              </div>
            )}
            {successCountryEdit && (
              <div
                className={`toast-success ${!toastEdit ? 'hidden-fade' : ''}`}
              >
                {' '}
                <i className="fas fa-check" />
                Country Edited
                <i
                  className="fas fa-times"
                  onClick={() => setToastEdit(false)}
                />
              </div>
            )}
          </div>
          <div className="country-list">
            {taxRulesDeleted && taxRulesDeleted.length > 0 && (
              <div className={`deleted ${!isDeleted ? 'hidden-fade' : ''}`}>
                <i className="fas fa-times" onClick={onClickClose} />
                {taxRulesDeleted && (
                  <div className="tax-rule-deleted">
                    <p>Tax rules deleted :</p>
                    <ul>
                      {taxRulesDeleted.map((taxRule, index) => (
                        <>
                          <li key={index}>{taxRule.id}</li>
                        </>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <div className="legend">
              <span>Country</span>
              <span>Code</span>
            </div>
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.01,
                  },
                },
              }}
              initial="hidden"
              animate="show"
              className="content"
            >
              {country.map((country, index) => (
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1 },
                  }}
                  className="item"
                  key={index}
                >
                  <span>{country.name}</span>
                  <span>{country.code}</span>
                  <Granted permissions={['u:country']}>
                    <Link
                      to={`/taxes/edit-country/${country.id}?rule=${query.get(
                        'rule'
                      )}&group=${query.get('group')}&country=${query.get(
                        'country'
                      )}`}
                      className="action edit"
                    >
                      Edit
                    </Link>
                  </Granted>
                  <Granted permissions={['d:country']}>
                    <button
                      className="delete"
                      onClick={() =>
                        submitDeleteCountry(country.id, country.name)
                      }
                    >
                      <i className="fas fa-trash"></i>
                    </button>{' '}
                  </Granted>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <Pagination
            meta={meta}
            uri={`/taxes?rule=${query.get('rule')}&group=${query.get(
              'group'
            )}&country=`}
          />
        </div>
      )}
    </>
  )
}

export default Country
