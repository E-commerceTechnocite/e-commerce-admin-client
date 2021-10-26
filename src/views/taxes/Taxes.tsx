import * as React from 'react'
import { useEffect, useState } from 'react'
import Country from '../../components/country/Country'
import Granted from '../../components/Granted'
import TaxGroup from '../../components/taxGroup/TaxGroup'
import TaxRate from '../../components/taxRate/TaxRate'
import TaxRule from '../../components/taxRule/TaxRule'

interface ITaxesProps {
  location?: {
    state: {
      success?: boolean
      successGroup?: boolean
      successRate?: boolean
      successCountry?: boolean
    }
  }
}

const Taxes: React.FunctionComponent<ITaxesProps> = (props) => {
  const [success, setSuccess] = useState<boolean | undefined>()
  const [successGroup, setSuccessGroup] = useState<boolean | undefined>()
  const [successRate, setSuccessRate] = useState<boolean | undefined>()
  const [successCountry, setSuccessCountry] = useState<boolean | undefined>()
  const [group, setGroup] = useState<boolean>(true)
  const [rate, setRate] = useState<boolean>(false)
  const [country, setCountry] = useState<boolean>(false)
  const [isUpdated, setIsUpdated] = useState<boolean>(false)

  const switchTabs = (name: string): void => {
    setGroup(false)
    setRate(false)
    setCountry(false)
    switch (name) {
      case 'group':
        setGroup(true)
        break
      case 'rate':
        setRate(true)
        break
      case 'country':
        setCountry(true)
        break
      default:
        break
    }
  }
  const childToParent = () => {
    setIsUpdated(!isUpdated)
  }

  useEffect(() => {
    if (props.location.state !== undefined) {
      console.log(props.location.state)
      if (props.location.state.success) setSuccess(props.location.state.success)
      if (props.location.state.successGroup)
        setSuccessGroup(props.location.state.successGroup)
      if (props.location.state.successRate) {
        setGroup(false)
        setRate(true)
        setSuccessRate(props.location.state.successRate)
      }
      if (props.location.state.successCountry) {
        setGroup(false)
        setCountry(true)
        setSuccessCountry(props.location.state.successCountry)
      }
    }
  }, [])
  return (
    <div className="taxes">
      <Granted permissions={['r:tax-rule']}>
        <TaxRule success={success} isUpdated={isUpdated}/>
      </Granted>
      <div className="tabs">
        <div className="buttons">
          <button
            onClick={() => switchTabs('group')}
            className={group ? 'action' : 'second-action'}
          >
            Group
          </button>
          <button
            onClick={() => switchTabs('rate')}
            className={rate ? 'action' : 'second-action'}
          >
            Rate
          </button>
          <button
            onClick={() => switchTabs('country')}
            className={country ? 'action' : 'second-action'}
          >
            Country
          </button>
        </div>
        <div className="lists">
          {group && (
            <>
              <Granted permissions={['r:tax-rule-group']}>
                <TaxGroup successGroup={successGroup} groupToParent={childToParent}/>
              </Granted>
            </>
          )}
          {rate && (
            <>
              <Granted permissions={['r:tax']}>
                <TaxRate successRate={successRate} rateToParent={childToParent}/>
              </Granted>
            </>
          )}
          {country && (
            <>
              <Granted permissions={['r:country']}>
                <Country successCountry={successCountry} countryToParent={childToParent}/>
              </Granted>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
export default Taxes
