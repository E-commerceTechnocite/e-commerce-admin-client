import * as React from 'react'
import { useEffect, useState } from 'react'
import { http } from '../../util/http'
import { config } from '../../index'
import './TaxRule.scss'
import { useHistory } from 'react-router'
import { sendRequest } from '../../util/helpers/refresh'
import { TaxRuleModel } from '../../models/taxRule/taxRule.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import Pagination from '../pagination/Pagination'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Granted from '../Granted'
import TaxRuleSkeleton from './skeleton/TaxRuleSkeleton'
import { useQuery } from '../../util/hook/useQuery'
import Legend from '../legend/legend'

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
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const query = useQuery()
  const [toast, setToast] = useState<boolean>(false)
  const [toastEdit, setToastEdit] = useState<boolean>(false)
  const [refreshPage, setRefreshPage] = useState<boolean>(false)
  const history = useHistory()
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
   * Returns get request for tax rule
   * @returns request
   */
  const TaxRuleRequest = () => {
    return http.get<PaginationModel<TaxRuleModel>>(
      `${config.api}/v1/tax-rule${
        query.get('search')
          ? `?orderBy=${query.get('search')}&order=${query.get('order')}&`
          : '?'
      }page=${query.get('rule')}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }
    )
  }
  /**
   * Submits get request for tax rule
   */
  const SubmitTaxRule = async () => {
    let { data, error } = await sendRequest(TaxRuleRequest)
    if (error) {
      if (error.statusCode === 400) {
        history.push('/taxes')
        return
      }
      if (error.statusCode === 404) {
        history.push('/not-found')
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
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
              <input type="text" placeholder="Search..." />
            </div>
            <Granted permissions={['c:tax-rule']}>
              <Link
                to={`/taxes/add-tax-rule?group=${query.get(
                  'group'
                )}&country=${query.get('country')}${queryGroup}${queryCountry}`}
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
                      to={`/taxes/edit-tax-rule/${tax.id}?rule=${query.get(
                        'rule'
                      )}&group=${query.get('group')}&country=${query.get(
                        'country'
                      )}${querySearch}${queryGroup}${queryCountry}`}
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
            restUri={`&group=${query.get('group')}&country=${query.get(
              'country'
            )}`}
          />
        </div>
      )}
    </>
  )
}

export default TaxRule
