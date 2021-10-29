import * as React from 'react'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { sendRequest } from '../../util/helpers/refresh'
import { http } from '../../util/http'
import { config } from '../../index'
import { PaginationModel } from '../../models/pagination/pagination.model'
import { TaxRuleGroupModel } from '../../models/product/tax-rule-group.model'
import { PaginationMetadataModel } from '../../models/pagination/pagination-metadata.model'
import Pagination from '../pagination/Pagination'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './TaxGroup.scss'
import Granted from '../Granted'
import { auth } from '../../util/helpers/auth'
import { TaxRuleModel } from '../../models/product/tax-rule.model'
import { ProductModel } from '../../models/product/product.model'
import TaxGroupSkeleton from './skeleton/TaxGroupSkeleton'

interface ITaxGroupProps {
  successGroup?: boolean | undefined
  groupToParent?: () => void
}

const TaxGroup: React.FunctionComponent<ITaxGroupProps> = ({
  successGroup,
  groupToParent,
}) => {
  const [group, setGroup] = useState<TaxRuleGroupModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [page, setPage] = useState<number>(1)
  const [toast, setToast] = useState<boolean>(false)
  const [refreshPage, setRefreshPage] = useState(false)
  const [taxRulesDeleted, setTaxRulesDeleted] = useState<TaxRuleModel[]>()
  const [productsDeleted, setProductsDeleted] = useState<ProductModel[]>()
  const [isDeleted, setIsDeleted] = useState<boolean>(false)
  const history = useHistory()

  /**
   * Returns the get request for tax rule group
   * @returns request
   */
  const TaxRuleGroupRequest = () => {
    return http.get<PaginationModel<TaxRuleGroupModel>>(
      `${config.api}/v1/tax-rule-group?page=${page}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }
    )
  }
  /**
   * Sends the get request for tax rule group and sets the state values from response
   */
  const SubmitTaxRuleGroup = async () => {
    let { data, error } = await sendRequest(TaxRuleGroupRequest)
    if (error) {
      history.push('/login')
    }
    setGroup(data.data)
    setMeta(data.meta)
  }

  /**
   * Returns delete request of selected tax group
   * @param id
   * @returns request
   */
  const deleteTaxGroupRequest = (id: string) => {
    return http.delete(`${config.api}/v1/tax-rule-group/${id}`, null, {
      headers: { ...auth.headers },
    })
  }
  /**
   * Submits delete request of selected tax group
   * @param id
   * @param title
   */
  const submitDeleteTaxGroup = async (id: string, name: string) => {
    if (
      confirm(
        `Delete tax group: ${name}? \nAll products and tax rules related will be deleted.`
      )
    ) {
      let { data, error } = await sendRequest(deleteTaxGroupRequest, id)
      if (error) {
        history.push('/login')
      }
      setTaxRulesDeleted([...data[0].taxRules])
      setProductsDeleted([...data[1].products])
      setRefreshPage(!refreshPage)
      setIsDeleted(true)
      groupToParent()
    }
  }

  /**
   * Close the delete message
   */
  const onClickClose = () => {
    setIsDeleted(false)
    setTimeout(() => {
      setTaxRulesDeleted(null)
      setProductsDeleted(null)
    }, 1000)
  }

  useEffect(() => {
    SubmitTaxRuleGroup().then()
  }, [page, refreshPage])

  // Check if a tax group has been added and sends a confirmation toast
  useEffect(() => {
    if (successGroup === true) {
      setToast(true)
      setTimeout(() => {
        setToast(false)
      }, 10000)
    }
  }, [successGroup])

  // Hide delete confirmation message after 10 seconds
  useEffect(() => {
    if (isDeleted) {
      setTimeout(() => {
        setIsDeleted(false)
      }, 9000)
      setTimeout(() => {
        setTaxRulesDeleted(null)
        setProductsDeleted(null)
      }, 10000)
    }
  }, [isDeleted])

  return (
    <>
      {!group && !meta && <TaxGroupSkeleton />}
      {/* <TaxGroupSkeleton /> */}
      {group && meta && (
        <div className="tax-group">
          <div className="top">
            <div className="search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search..." />
            </div>
            <Granted permissions={['c:tax-rule-group']}>
              <Link to="/taxes/add-tax-group" className="action">
                New Group
              </Link>
            </Granted>
            <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
              {' '}
              <i className="fas fa-check" />
              Tax Group Added
              <i className="fas fa-times" onClick={() => setToast(false)} />
            </div>
          </div>
          <div className="group-list">
            {(productsDeleted || taxRulesDeleted) && (
              <div className={`deleted ${!isDeleted ? 'hidden-fade' : ''}`}>
                <i className="fas fa-times" onClick={onClickClose} />
                {taxRulesDeleted && (
                  <div className="tax-group-deleted">
                    {taxRulesDeleted.length > 0 && <p>Tax rules deleted :</p>}
                    <ul>
                      {taxRulesDeleted.map((taxRule, index) => (
                        <>
                          <li key={index}>{taxRule.id}</li>
                        </>
                      ))}
                    </ul>
                  </div>
                )}
                {productsDeleted && (
                  <div className="product-deleted">
                    {productsDeleted.length > 0 && <p>Products deleted :</p>}
                    <ul>
                      {productsDeleted.map((product, index) => (
                        <>
                          <li key={index}>
                            {product.id} - {product.title} -{' '}
                            {`${product.price}€`}
                          </li>
                        </>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <div className="legend">
              <span>Name</span>
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
              {group.map((group, index) => (
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1 },
                  }}
                  className="item"
                  key={index}
                >
                  <span>{group.name}</span>
                  <Granted permissions={['u:tax-rule-group']}>
                    <Link
                      to={`/taxes/edit-tax-group/${group.id}`}
                      className="action edit"
                    >
                      Edit
                    </Link>
                  </Granted>
                  <Granted permissions={['d:tax-rule-group']}>
                    <button
                      className="delete"
                      onClick={() => submitDeleteTaxGroup(group.id, group.name)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </Granted>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <Pagination meta={meta} pageSetter={setPage} />
        </div>
      )}
    </>
  )
}

export default TaxGroup
