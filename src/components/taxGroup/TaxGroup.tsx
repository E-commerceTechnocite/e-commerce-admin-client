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
import { useQuery } from '../../util/hook/useQuery'
import Legend from '../legend/legend'

interface ITaxGroupProps {
  successGroup?: boolean | undefined
  successGroupEdit?: boolean | undefined
  groupToParent?: () => void
}

const TaxGroup: React.FunctionComponent<ITaxGroupProps> = ({
  successGroup,
  successGroupEdit,
  groupToParent,
}) => {
  const [group, setGroup] = useState<TaxRuleGroupModel[]>()
  const [meta, setMeta] = useState<PaginationMetadataModel>()
  const [toast, setToast] = useState<boolean>(false)
  const [toastEdit, setToastEdit] = useState<boolean>(false)
  const [refreshPage, setRefreshPage] = useState(false)
  const [taxRulesDeleted, setTaxRulesDeleted] = useState<TaxRuleModel[]>()
  const [productsDeleted, setProductsDeleted] = useState<ProductModel[]>()
  const [isDeleted, setIsDeleted] = useState<boolean>(false)
  const history = useHistory()
  const query = useQuery()
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
   * Returns the get request for tax rule group
   * @returns request
   */
  const TaxRuleGroupRequest = () => {
    return http.get<PaginationModel<TaxRuleGroupModel>>(
      `${config.api}/v1/tax-rule-group${
        query.get('searchGroup')
          ? `?orderBy=${query.get('searchGroup')}&order=${query.get(
              'orderGroup'
            )}&`
          : '?'
      }page=${query.get('group')}&limit=5`,
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
    if (!query.get('group')) {
      history.push('/taxes?rule=1&group=1&country=1&s=u')
      return
    }
    SubmitTaxRuleGroup().then()
  }, [
    refreshPage,
    query.get('group'),
    query.get('searchGroup'),
    query.get('orderGroup'),
  ])

  // Check if a tax group has been added and sends a confirmation toast
  useEffect(() => {
    if (successGroup === true) {
      setToast(true)
      setTimeout(() => {
        setToast(false)
      }, 10000)
    }
    if (successGroupEdit === true) {
      setToastEdit(true)
      setTimeout(() => {
        setToastEdit(false)
      }, 10000)
    }
  }, [successGroup, successGroupEdit])

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
      {group && meta && (
        <div className="tax-group">
          <div className="top">
            <div className="search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search..." />
            </div>
            <Granted permissions={['c:tax-rule-group']}>
              <Link
                to={`/taxes/add-tax-group?rule=${query.get(
                  'rule'
                )}&country=${query.get(
                  'country'
                )}${querySearch}${queryCountry}`}
                className="action"
              >
                New Group
              </Link>
            </Granted>
            {successGroup && (
              <div className={`toast-success ${!toast ? 'hidden-fade' : ''}`}>
                {' '}
                <i className="fas fa-check" />
                Tax Group Added
                <i className="fas fa-times" onClick={() => setToast(false)} />
              </div>
            )}
            {successGroupEdit && (
              <div
                className={`toast-success ${!toastEdit ? 'hidden-fade' : ''}`}
              >
                {' '}
                <i className="fas fa-check" />
                Tax Group Edited
                <i
                  className="fas fa-times"
                  onClick={() => setToastEdit(false)}
                />
              </div>
            )}
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
              <Legend
                uri={`/taxes`}
                name={`Name`}
                search={`name`}
                customQuery={`rule=${query.get(
                  'rule'
                )}&group=1&country=${query.get('country')}`}
                customSearch={`searchGroup`}
                customOrder={`orderGroup`}
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
                      to={`/taxes/edit-tax-group/${group.id}?rule=${query.get(
                        'rule'
                      )}&group=${query.get('group')}&country=${query.get(
                        'country'
                      )}${querySearch}${queryGroup}${queryCountry}`}
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
          <Pagination
            meta={meta}
            uri={`taxes?rule=${query.get('rule')}&group=`}
            restUri={`&country=${query.get('country')}`}
            customSearch={`searchGroup`}
            customOrder={`orderGroup`}
          />
        </div>
      )}
    </>
  )
}

export default TaxGroup
