import * as React from 'react'
import { useEffect, useState } from 'react'
import { http } from '../../util/http'
import { config } from '../../index'
import './TaxRule.scss'
import { useHistory } from 'react-router'
import { sendRequest } from '../../util/helpers/refresh'
import { TaxRuleModel } from '../../models/taxRule/taxRule.model'
import { PaginationModel } from '../../models/pagination/pagination.model'
import Loading from '../loading/Loading'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import Pagination from '../pagination/Pagination'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Granted from '../Granted'
import TaxRuleSkeleton from './skeleton/TaxRuleSkeleton'

interface ITaxRuleProps {
  success?: boolean | undefined
  groupUpdate?: boolean
  rateUpdate?: boolean
  countryUpdate?: boolean
  isUpdated?: boolean
}

const TaxRule: React.FunctionComponent<ITaxRuleProps> = ({
  success,
  groupUpdate,
  rateUpdate,
  countryUpdate,
  isUpdated,
}) => {
  const [taxRule, setTaxRule] = useState<TaxRuleModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [page, setPage] = useState<number>(1)
  const [toast, setToast] = useState<boolean>(false)
  const [refreshPage, setRefreshPage] = useState<boolean>(false)
  const history = useHistory()

  // Get request for taxRules
  const TaxRuleRequest = () => {
    return http.get<PaginationModel<TaxRuleModel>>(
      `${config.api}/v1/tax-rule?page=${page}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }
    )
  }
  const SubmitTaxRule = async () => {
    let { data, error } = await sendRequest(TaxRuleRequest)
    if (error) {
      history.push('/login')
    }
    setTaxRule(data.data)
    setMeta(data.meta)
  }

  // Delete request for tax rule
  const deleteTaxRequest = (id: string) => {
    return http.delete(`${config.api}/v1/tax-rule/${id}`, null, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  }
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
    SubmitTaxRule().then()
    console.log('----------')
    console.log(isUpdated)
    console.log('----------')
  }, [page, refreshPage, isUpdated])

  // Check if tax rule has been added
  useEffect(() => {
    if (success === true) {
      setToast(true)
      setTimeout(() => {
        setToast(false)
      }, 10000)
    }
  }, [success])

  return (
    <>
      {!taxRule && !meta && <TaxRuleSkeleton/>}
      {taxRule && meta && (
        <div className="tax-rule">
          <div className="top">
            <div className="search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search..." />
            </div>
            <Granted permissions={['c:tax-rule']}>
              <Link to="/taxes/add-tax-rule" className="action">
                New Tax
              </Link>
            </Granted>
            <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
              {' '}
              <i className="fas fa-check" />
              Tax Rule Added
              <i className="fas fa-times" onClick={() => setToast(false)} />
            </div>
          </div>
          <div className="tax-list">
            <div className="legend">
              <span>Name</span>
              <span>Rate</span>
              <span>Country</span>
              <span>Zip code</span>
              <span>Description</span>
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
                  <span>{tax.tax.rate}%</span>
                  <span>{tax.country.name}</span>
                  <span>{tax.zipCode}</span>
                  <span>
                    {tax.description.length >= 100
                      ? tax.description.substr(0, 50) + '...'
                      : tax.description}
                  </span>
                  <Granted permissions={['u:tax-rule']}>
                    <Link
                      to={`/taxes/edit-tax-rule/${tax.id}`}
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
          {/* <Pagination meta={meta} pageSetter={setPage} /> */}
        </div>
      )}
    </>
  )
}

export default TaxRule
