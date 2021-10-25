import * as React from "react"
import { useHistory } from "react-router-dom"

interface IPreviousProps {}

const Previous: React.FunctionComponent<IPreviousProps> = () => {
  const history = useHistory()
  return (
    <button 
      className="arrowBackButton"
      style={{ marginBottom: "15px" }}
      onClick={() => history.goBack()}
    >
      <i className="fas fa-caret-left" /> Previous Page
    </button>
  )
}

export default Previous;
