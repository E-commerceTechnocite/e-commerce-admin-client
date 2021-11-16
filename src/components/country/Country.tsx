import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import { TaxRuleModel } from '../../models/product/tax-rule.model'
import { CountryModel } from '../../models/product/country.model'
import CountrySkeleton from './skeleton/CountrySkeleton'
import { useCallback, useEffect, useState } from 'react'
import { sendRequest } from '../../util/helpers/refresh'
import { useQuery } from '../../util/hook/useQuery'
import { Link, useHistory } from 'react-router-dom'
import Pagination from '../pagination/Pagination'
import { auth } from '../../util/helpers/auth'
import param from '../../util/helpers/queries'
import Uri from '../../util/helpers/Uri'
import { motion } from 'framer-motion'
import { http } from '../../util/http'
import Legend from '../legend/legend'
import { config } from '../../index'
import Granted from '../Granted'
import * as React from 'react'
import './Country.scss'
import _ from 'lodash'
import Toast from '../toast/Toast'

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
  const [taxRulesDeleted, setTaxRulesDeleted] = useState<TaxRuleModel[]>()
  const [searchCountry, setSearchCountry] = useState<string>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [isDeleted, setIsDeleted] = useState<boolean>(false)
  const [country, setCountry] = useState<CountryModel[]>()
  const [refreshPage, setRefreshPage] = useState(false)
  const history = useHistory()
  const query = useQuery()
  const queries = param()

  /**
   * Returns the get request for country
   * @returns request
   */
  const countryRequest = () => {
    const url = !query.get('qCountry')
      ? new Uri('/v1/country')
      : new Uri('/v1/country/search')
    url
      .setQuery('page', query.get('country') ? query.get('country') : '1')
      .setQuery('orderBy', query.get('searchCountry'))
      .setQuery('order', query.get('orderCountry'))
      .setQuery('qCountry', query.get('qCountry'))
      .setQuery('limit', '5')

    return http.get<PaginationModel<CountryModel>>(url.href, {
      headers: {
        ...auth.headers,
      },
    })
  }
  /**
   * Submits the get request for country and sets the state values from response
   */
  const submitCountry = async () => {
    let { data, error } = await sendRequest(countryRequest)
    if (error) {
      if (error.statusCode === 400 || error.statusCode === 404) {
        history.push('/categories')
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

  const debounce = useCallback(
    _.debounce((searchValue: string) => {
      setSearchCountry(searchValue)
      history.push({
        pathname: '/taxes',
        search: `${queries.page('rule', 1)}${queries.page(
          'group'
        )}&country=1&s=u${
          searchValue ? `&q=${searchValue}` : ''
        }${queries.searchOrder('search', 'order')}${queries.searchOrder(
          'searchGroup',
          'orderGroup'
        )}`,
      })
    }, 500),
    []
  )

  useEffect(() => {
    if (!query.get('country')) {
      history.push('/taxes?rule=1&group=1&country=1&s=u')
      return
    }
    submitCountry().then()
  }, [
    refreshPage,
    query.get('country'),
    query.get('searchCountry'),
    query.get('orderCountry'),
    query.get('qCountry'),
  ])

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
              <i
                className="fas fa-search"
                onClick={() => debounce(searchCountry)}
              />
              <input
                type="text"
                placeholder="Search..."
                onKeyPress={(e) =>
                  e.key === 'Enter' ? debounce(e.currentTarget.value) : ''
                }
              />
            </div>
            <Granted permissions={['c:country']}>
              <Link
                to={`/taxes/add-country${queries.page('rule', 1)}${queries.page(
                  'group'
                )}${queries.searchOrder(
                  'search',
                  'order'
                )}${queries.searchOrder(
                  'searchGroup',
                  'orderGroup'
                )}${queries.q('q')}${queries.q('qGroup')}`}
                className="action"
              >
                New country
              </Link>
            </Granted>
            {successCountry && (
              <Toast success={successCountry} name={`Tax Group`} />
            )}
            {successCountryEdit && (
              <Toast
                success={successCountryEdit}
                name={`Tax Group`}
                edit={true}
              />
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
              <Legend
                uri={`/taxes`}
                name={`Name`}
                search={`name`}
                customQuery={`rule=${query.get(
                  'rule'
                )}&group=1&country=${query.get('country')}`}
                customSearch={`searchCountry`}
                customOrder={`orderCountry`}
              />
              <Legend
                uri={`/taxes`}
                name={`Code`}
                search={`code`}
                customQuery={`rule=${query.get('rule')}&group=${query.get(
                  'group'
                )}&country=1`}
                customSearch={`searchCountry`}
                customOrder={`orderCountry`}
              />
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
                      to={`/taxes/edit-country/${country.id}${queries.page(
                        'rule',
                        1
                      )}${queries.page('group')}${queries.page(
                        'country'
                      )}${queries.searchOrder(
                        'search',
                        'order'
                      )}${queries.searchOrder(
                        'searchGroup',
                        'orderGroup'
                      )}${queries.searchOrder(
                        'searchCountry',
                        'orderCountry'
                      )}${queries.q('q')}${queries.q('qGroup')}${queries.q(
                        'qCountry'
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
            uri={`/taxes${queries.page('rule', 1)}${queries.page(
              'group'
            )}&country=`}
            customSearch={`${queries.searchOrder(
              'search',
              'order'
            )}${queries.searchOrder(
              'searchGroup',
              'orderGroup'
            )}${queries.searchOrder('searchCountry', 'orderCountry')}`}
            customQ={`${queries.q('q')}${queries.q('qGroup')}${queries.q(
              'qCountry'
            )}`}
          />
        </div>
      )}
    </>
  )
}

export default Country
