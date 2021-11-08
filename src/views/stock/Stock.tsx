import * as React from 'react'
import { useEffect, useState } from 'react'
import Stocks from '../../components/stock/Stocks'
import './Stock.scss'

interface IStocksProps {
  location?: {
    state: {
      success?: boolean
    }
  }
}

const Stock: React.FunctionComponent<IStocksProps> = (props) => {
  const [success, setSuccess] = useState<boolean | undefined>()
  useEffect(() => {
    if (props.location.state !== undefined) {
      setSuccess(props.location.state.success)
    } 
  }, [])
  return (
    <div className="stocks-page">
      <Stocks success={success}/>
    </div>
  )
}
export default Stock
