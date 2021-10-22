import * as React from 'react'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { CountryModel } from '../../models/product/country.model'
import { http } from '../../util/http'
import { config } from '../../index'
import { sendRequest } from '../../util/helpers/refresh'
import Previous from '../previous/Previous'
import { Formik } from 'formik'
import TextInput from '../inputs/TextInput'
import { countrySchema } from '../../util/validation/taxValidation'
import Granted from '../Granted'
import { ProductModel } from '../../models/product/product.model'
import NumberInput from '../inputs/NumberInput'
import { stockSchema } from '../../util/validation/productValidation'

interface IActionStockProps {
  stock?: {
    physical?: number
    incoming?: number
    pending?: number
  }
}

const ActionStock: React.FunctionComponent<IActionStockProps> = () => {
  const [initialValues, seInitialValues] = useState<IActionStockProps>({
    stock: {
      physical: 0,
      incoming: 0,
      pending: 0,
    },
  })
  const [stock, setStock] = useState<IActionStockProps>()
  const params: { slug: string } = useParams()
  const history = useHistory()

  /**
   * Returns  patch request for Stock product
   * @param data
   * @returns request
   */
  const stockPatchRequest = (data: IActionStockProps) => {
    return http.patch(`${config.api}/v1/product/${params.slug}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  }
  /**
   * Submits the post request for new Stock product
   * @param data
   */
  const submitStockPatch = async (data: IActionStockProps) => {
    let { error } = await sendRequest(stockPatchRequest, data)
    if (error) {
      history.push('/login')
    }
    history.push({
      pathname: '/stock',
      state: { success: true },
    })
  }

  /**
   * Returns get request for Stock product
   * @returns
   */
  const currentTaxRateRequest = () => {
    return http.get<ProductModel>(`${config.api}/v1/product/${params.slug}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  }
  /**
   * Submits get request for Stock product
   */
  const submitCurrentTaxRate = async () => {
    let { data, error } = await sendRequest(currentTaxRateRequest)
    if (error) {
      history.push('/login')
    }
    if (data.stock !== null) setStock(data)
  }

  useEffect(() => {
    if (params.slug) {
      submitCurrentTaxRate().then()
    }
  }, [params.slug])
  useEffect(() => {
    if (params.slug) {
      if (stock) {
        console.log(stock.stock)
        seInitialValues({
          stock: {
            physical: stock.stock.physical,
            incoming: stock.stock.incoming,
            pending: stock.stock.pending,
          },
        })
      }
    }
  }, [stock])

  return (
    <>
      <Previous />
      <div className="action-stock">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={stockSchema}
          onSubmit={(data) => {
          }}
        >
          {({ handleSubmit, errors }) => {
            console.log(errors)
            return (
              <>
                <form onSubmit={handleSubmit}>
                  <NumberInput name={'stock.physical'} label={'Physical'} />
                  <NumberInput name={'stock.incoming'} label={'Incoming'} />
                  <NumberInput name={'stock.pending'} label={'Pending'} />
                  {params.slug && (
                    <Granted permissions={['u:country']}>
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

export default ActionStock
