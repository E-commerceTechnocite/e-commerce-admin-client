import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import param, { requestParams } from '../../util/helpers/queries'
import { TaxRuleModel } from '../../models/taxRule/taxRule.model'
import { useCallback, useEffect, useState } from 'react'
import { sendRequest } from '../../util/helpers/refresh'
import TaxRuleSkeleton from './skeleton/TaxRuleSkeleton'
import { useQuery } from '../../util/hook/useQuery'
import Pagination from '../pagination/Pagination'
import { auth } from '../../util/helpers/auth'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { http } from '../../util/http'
import { motion } from 'framer-motion'
import Legend from '../legend/legend'
import { config } from '../../index'
import Granted from '../Granted'
import * as React from 'react'
import './TaxRule.scss'
import _ from 'lodash'

interface ITaxRuleProps {
  success?: boolean | undefined
  successEdit?: boolean | undefined
  isUpdated?: boolean
}

const TaxRule: React.FunctionComponent<ITaxRuleProps> = ({
  success,
  successEdit,
  isUpdated,
}) => {
  const [taxRule, setTaxRule] = useState<TaxRuleModel[]>()
  const [refreshPage, setRefreshPage] = useState<boolean>(false)
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [toastEdit, setToastEdit] = useState<boolean>(false)
  const [toast, setToast] = useState<boolean>(false)
  const requestParam = requestParams()
  const history = useHistory()
  const query = useQuery()
  const queries = param()

  /**
   * Returns get request for tax rule
   * @returns request
   */
  const TaxRuleRequest = () => {
    const request = !query.get('q')
      ? `${config.api}/v1/tax-rule${requestParam.getOrderBy(
          'search',
          'order'
        )}${requestParam.getPage('rule')}&limit=5`
      : `${config.api}/v1/tax-rule/search${requestParam.getPage(
          'rule',
          'q'
        )}${requestParam.getQ('q')}&limit=5`

    return http.get<PaginationModel<TaxRuleModel>>(request, {
      headers: {
        ...auth.headers,
      },
    })
  }
  /**
   * Submits get request for tax rule
   */
  const SubmitTaxRule = async () => {
    let { data, error } = await sendRequest(TaxRuleRequest)
    if (error) {
      if (error.statusCode === 400 || error.statusCode === 404) {
        history.push('/categories')
        return
      }
      history.push('/login')
    }
    setTaxRule(data.data)
    setMeta(data.meta)
  }

  /**
   * Returns delete request for specific tax rule
   * @param id
   * @returns request
   */
  const deleteTaxRequest = (id: string) => {
    return http.delete(`${config.api}/v1/tax-rule/${id}`, null, {
      headers: {
        ...auth.headers,
      },
    })
  }

  /**
   * Submits delete request for specific tax rule
   * @param id
   * @param name
   * @param rate
   * @param country
   */
  const deleteTax = async (
    id: string,
    name: number,
    rate: number,
    country: string
  ) => {
    if (confirm(`Delete tax rule: ${name} - ${country} - ${rate}% ?`)) {
      let { error } = await sendRequest(deleteTaxRequest, id)
      if (error) {
        history.push('/login')
      }
      setRefreshPage(!refreshPage)
    }
  }

  const debounce = useCallback(
    _.debounce((searchValue: string) => {
      history.push({
        pathname: '/taxes',
        search: `?rule=1&s=u${
          searchValue ? `&q=${searchValue}` : ''
        }${queries.page('group')}${queries.page(
          'country'
        )}${queries.searchOrder(
          'searchGroup',
          'orderGroup'
        )}${queries.searchOrder('searchCountry', 'orderCountry')}`,
      })
    }, 500),
    []
  )

  // Call the requests before render
  useEffect(() => {
    if (!query.get('rule')) {
      history.push('/taxes?rule=1&group=1&country=1&s=u')
      return
    }
    SubmitTaxRule().then()
  }, [
    refreshPage,
    isUpdated,
    query.get('rule'),
    query.get('search'),
    query.get('order'),
    query.get('q'),
  ])

  // Check if tax rule has been added
  useEffect(() => {
    if (success === true) {
      setToast(true)
      setTimeout(() => {
        setToast(false)
      }, 10000)
    }
    if (successEdit === true) {
      setToastEdit(true)
      setTimeout(() => {
        setToastEdit(false)
      }, 10000)
    }
  }, [success, successEdit])

  return (
    <>
      {!taxRule && !meta && <TaxRuleSkeleton />}
      {taxRule && meta && (
        <div className="tax-rule">
          <div className="top">
            <div className="search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => debounce(e.target.value)}
              />
            </div>
            <Granted permissions={['c:tax-rule']}>
              <Link
                to={`/taxes/add-tax-rule${queries.page(
                  'group',
                  1
                )}${queries.page('country')}${queries.searchOrder(
                  'searchGroup',
                  'orderGroup'
                )}${queries.searchOrder(
                  'searchCountry',
                  'orderCountry'
                )}${queries.q('qGroup')}${queries.q('qCountry')}`}
                className="action"
              >
                New Tax
              </Link>
            </Granted>
            {success && (
              <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
                {' '}
                <i className="fas fa-check" />
                Tax Rule Added
                <i className="fas fa-times" onClick={() => setToast(false)} />
              </div>
            )}
            {successEdit && (
              <div
                className={`toast-success ${!toastEdit ? 'hidden-fade' : ''}`}
              >
                {' '}
                <i className="fas fa-check" />
                Tax Rule Edited
                <i
                  className="fas fa-times"
                  onClick={() => setToastEdit(false)}
                />
              </div>
            )}
          </div>
          <div className="tax-list">
            <div className="legend">
              <Legend
                uri={`/taxes`}
                name={`Name`}
                search={`taxRuleGroup.name`}
                customQuery={`rule=1&group=${query.get(
                  'group'
                )}&country=${query.get('country')}`}
              />
              <Legend
                uri={`/taxes`}
                name={`Rate`}
                search={`tax`}
                customQuery={`rule=1&group=${query.get(
                  'group'
                )}&country=${query.get('country')}`}
              />
              <Legend
                uri={`/taxes`}
                name={`Country`}
                search={`country.name`}
                customQuery={`rule=1&group=${query.get(
                  'group'
                )}&country=${query.get('country')}`}
              />
              <Legend
                uri={`/taxes`}
                name={`Zip code`}
                search={`zipCode`}
                customQuery={`rule=1&group=${query.get(
                  'group'
                )}&country=${query.get('country')}`}
              />
              <Legend
                uri={`/taxes`}
                name={`Description`}
                search={`description`}
                customQuery={`rule=1&group=${query.get(
                  'group'
                )}&country=${query.get('country')}`}
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
              {taxRule.map((tax, index) => (
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1 },
                  }}
                  className="item"
                  key={index}
                >
                  <span>{tax.taxRuleGroup.name}</span>
                  <span>{tax.tax}%</span>
                  <span>{tax.country.name}</span>
                  <span>{tax.zipCode}</span>
                  <span>
                    {tax.description.length >= 100
                      ? tax.description.substr(0, 50) + '...'
                      : tax.description}
                  </span>
                  <Granted permissions={['u:tax-rule']}>
                    <Link
                      to={`/taxes/edit-tax-rule/${tax.id}${queries.page(
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
                  <Granted permissions={['d:tax-rule']}>
                    <button
                      className="delete"
                      onClick={() =>
                        deleteTax(
                          tax.id,
                          tax.taxRuleGroup.name,
                          tax.tax.rate,
                          tax.country.name
                        )
                      }
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </Granted>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <Pagination
            meta={meta}
            uri={`taxes?rule=`}
            restUri={`${queries.page('group')}${queries.page('country')}`}
          />
        </div>
      )}
    </>
  )
}

export default TaxRule
