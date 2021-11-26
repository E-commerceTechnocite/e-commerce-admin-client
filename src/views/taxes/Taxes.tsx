import * as React from 'react'
import { useEffect, useState } from 'react'
import Country from '../../components/country/Country'
import Granted from '../../components/Granted'
import TaxGroup from '../../components/taxGroup/TaxGroup'
import TaxRule from '../../components/taxRule/TaxRule'
import { useQuery } from '../../util/hook/useQuery'

interface ITaxesProps {
  location?: {
    state: {
      success?: boolean
      successEdit?: boolean
      successGroup?: boolean
      successGroupEdit?: boolean
      successCountry?: boolean
      successCountryEdit?: boolean
    }
  }
}

const Taxes: React.FunctionComponent<ITaxesProps> = (props) => {
  const [success, setSuccess] = useState<boolean | undefined>()
  const [successEdit, setSuccessEdit] = useState<boolean | undefined>()
  const [successGroup, setSuccessGroup] = useState<boolean | undefined>()
  const [successGroupEdit, setSuccessGroupEdit] = useState<
    boolean | undefined
  >()
  const [successCountry, setSuccessCountry] = useState<boolean | undefined>()
  const [successCountryEdit, setSuccessCountryEdit] = useState<
    boolean | undefined
  >()
  const [group, setGroup] = useState<boolean>(true)
  const [rate, setRate] = useState<boolean>(false)
  const [country, setCountry] = useState<boolean>(false)
  const [isUpdated, setIsUpdated] = useState<boolean>(false)
  const query = useQuery()

  const switchTabs = (name: string): void => {
    setGroup(false)
    setRate(false)
    setCountry(false)
    switch (name) {
      case 'group':
        setGroup(true)
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
    if (query.get('s')) window.scrollTo(0, 0)
    if (props.location.state !== undefined) {
      if (props.location.state.success) setSuccess(props.location.state.success)
      if (props.location.state.successEdit)
        setSuccessEdit(props.location.state.successEdit)

      if (props.location.state.successGroup)
        setSuccessGroup(props.location.state.successGroup)
      if (props.location.state.successGroupEdit)
        setSuccessGroupEdit(props.location.state.successGroupEdit)

      if (props.location.state.successCountry) {
        setGroup(false)
        setCountry(true)
        setSuccessCountry(props.location.state.successCountry)
      }
      if (props.location.state.successCountryEdit) {
        setGroup(false)
        setCountry(true)
        setSuccessCountryEdit(props.location.state.successCountryEdit)
      }
    }
  }, [])
  return (
    <div className="taxes" style={{overflow: 'hidden'}}>
      <Granted permissions={['r:tax-rule']}>
        <TaxRule
          success={success}
          successEdit={successEdit}
          isUpdated={isUpdated}
        />
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
                <TaxGroup
                  successGroup={successGroup}
                  successGroupEdit={successGroupEdit}
                  groupToParent={childToParent}
                />
              </Granted>
            </>
          )}
          {country && (
            <>
              <Granted permissions={['r:country']}>
                <Country
                  successCountry={successCountry}
                  successCountryEdit={successCountryEdit}
                  countryToParent={childToParent}
                />
              </Granted>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
export default Taxes
