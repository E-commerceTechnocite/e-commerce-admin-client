import * as React from 'react'
import { useHistory } from 'react-router'
import OrdersList from '../components/orders/OrdersList'

const Orders: React.FunctionComponent = () => {
  const history = useHistory()
  return (
    <>
      <OrdersList />
    </>
  )
}
export default Orders
