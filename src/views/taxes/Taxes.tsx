import * as React from "react"
import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import TaxGroup from "../../components/taxGroup/TaxGroup"
import TaxRule from "../../components/taxRule/TaxRule"
interface ITaxesProps {
  location?: {
    state: {
      success?: boolean
      successGroup?: boolean
    }
  }
}

const Taxes: React.FunctionComponent<ITaxesProps> = (props) => {
  const [success, setSuccess] = useState<boolean | undefined>()
  const [successGroup, setSuccessGroup] = useState<boolean | undefined>()
  const [group, setGroup] = useState<boolean>(true)
  const [rate, setRate] = useState<boolean>(false)
  const [country, setCountry] = useState<boolean>(false)

  const switchTabs = (name: string): void => {
    setGroup(false)
    setRate(false)
    setCountry(false)
    switch (name) {
      case "group":
        setGroup(true)
        break
      case "rate":
        setRate(true)
        break
      case "country":
        setCountry(true)
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (props.location.state !== undefined) {
      console.log(props.location.state)
      if (props.location.state.success) setSuccess(props.location.state.success)
      if (props.location.state.successGroup) setSuccessGroup(props.location.state.successGroup)
    } else {
      console.log(undefined)
    }
  }, [])
  useEffect(() => {
    
  }, [group,rate,country])
  return (
    <div className="taxes">
      <TaxRule success={success} />
      <div className="tabs">
        <div className="buttons">
          <button
            onClick={() => switchTabs("group")}
            className={group ? "action" : "second-action"}
          >
            Group
          </button>
          <button
            onClick={() => switchTabs("rate")}
            className={rate ? "action" : "second-action"}
          >
            Rate
          </button>
          <button
            onClick={() => switchTabs("country")}
            className={country ? "action" : "second-action"}
          >
            Country
          </button>
        </div>
        <div className="lists">
          {group && (
            <>
              <TaxGroup successGroup={successGroup}/>
            </>
          )}
          {rate && (
            <>
              <div>Rate</div>
            </>
          )}
          {country && (
            <>
              <div>Country</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
export default Taxes
