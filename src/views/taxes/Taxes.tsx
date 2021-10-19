import * as React from "react"
import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import TaxRule from "../../components/taxRule/TaxRule"
interface ITaxesProps {
    location?: {
        state: {
          success?: boolean
        }
      }
}


const Taxes: React.FunctionComponent<ITaxesProps> = (props) => {
    const [success, setSuccess] = useState<boolean|undefined>()
    useEffect(() => {
        if (props.location.state !== undefined) {
          console.log(props.location.state)
          setSuccess(props.location.state.success)
        } else {
          console.log(undefined)
        }
        
      }, [])
  return (
    <div className="taxes">
        <TaxRule success={success}/>
    </div>
  )
  
}
export default Taxes
