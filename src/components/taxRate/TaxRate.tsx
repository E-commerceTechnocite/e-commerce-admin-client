import * as React from 'react'
import { useEffect, useState } from 'react'
import { http } from '../../util/http'
import { config } from '../../index'
import './TaxRate.scss'
import { sendRequest } from '../../util/helpers/refresh'
import { useHistory } from 'react-router'
import { TaxModel } from '../../models/product/tax.model'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import Pagination from '../pagination/Pagination'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Granted from '../Granted'
import { auth } from '../../util/helpers/auth'
import { TaxRuleModel } from '../../models/product/tax-rule.model'

interface ITaxRateProps {
  successRate?: boolean | undefined
  rateToParent?: () => void
}

interface DeleteTax {
  entityType: string
  taxRules: {
    id: string
  }[]
}

const TaxRate: React.FunctionComponent<ITaxRateProps> = ({
  successRate,
  rateToParent,
}) => {
  const [page, setPage] = useState<number>(1)
  const [rate, setRate] = useState<TaxModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [taxRulesDeleted, setTaxRulesDeleted] = useState<TaxRuleModel[]>()
  const [refreshPage, setRefreshPage] = useState(false)
  const [isDeleted, setIsDeleted] = useState<boolean>(false)
  const [toast, setToast] = useState<boolean>(false)
  const history = useHistory()

  /**
   * Returns the get request for tax rule rate
   * @returns: request
   */
  const TaxRuleRateRequest = () => {
    return http.get<PaginationModel<TaxModel>>(
      `${config.api}/v1/tax?page=${page}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }
    )
  }
  /**
   * Submits the get request for tax rule rate and sets the state values from response
   */
  const SubmitTaxRateGroup = async () => {
    let { data, error } = await sendRequest(TaxRuleRateRequest)
    if (error) {
      history.push('/login')
    }
    setRate(data.data)
    setMeta(data.meta)
  }

  /**
   * Returns delete request of selected tax rate
   * @param id: string
   * @returns: request
   */
  const deleteTaxRateRequest = (id: string) => {
    return http.delete<DeleteTax>(`${config.api}/v1/tax/${id}`, null, {
      headers: { ...auth.headers },
    })
  }
  /**
   * Submits delete request of selected tax rate
   * @param id: string
   * @param rate: number
   */
  const submitDeleteTaxRate = async (id: string, rate: number) => {
    if (
      confirm(
        `Delete tax rate: ${rate}%? \nAll tax rules related will be deleted.`
      )
    ) {
      let { data, error } = await sendRequest(deleteTaxRateRequest, id)
      if (error) {
        console.log('error lol')
        history.push('/login')
      }
      setTaxRulesDeleted(data[0].taxRules)
      setRefreshPage(!refreshPage)
      setIsDeleted(true)
      rateToParent()
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
    SubmitTaxRateGroup().then()
  }, [page, refreshPage])

  // Check if a tax rate has been added and sends a confirmation toast
  useEffect(() => {
    if (successRate === true) {
      setToast(true)
      setTimeout(() => {
        setToast(false)
      }, 10000)
    }
  }, [successRate])

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
      <div className="tax-rate">
        <div className="top">
          <div className="search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search..." />
          </div>
          <Granted permissions={['c:tax']}>
            <Link to="/taxes/add-tax-rate" className="action">
              New rate
            </Link>
          </Granted>
          <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
            {' '}
            <i className="fas fa-check" />
            Tax Rate Added
            <i className="fas fa-times" onClick={() => setToast(false)} />
          </div>
        </div>
        {rate && meta && (
          <>
            <div className="rate-list">
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
                <span>Rate</span>
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
                {rate.map((rate, index) => (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1 },
                    }}
                    className="item"
                    key={index}
                  >
                    <span>{rate.rate}%</span>
                    <Granted permissions={['u:tax']}>
                      <Link
                        to={`/taxes/edit-tax-rate/${rate.id}`}
                        className="action edit"
                      >
                        Edit
                      </Link>
                    </Granted>
                    <Granted permissions={['d:tax']}>
                      <button
                        className="delete"
                        onClick={() => submitDeleteTaxRate(rate.id, rate.rate)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </Granted>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <Pagination meta={meta} pageSetter={setPage} />
          </>
        )}
      </div>
    </>
  )
}

export default TaxRate
