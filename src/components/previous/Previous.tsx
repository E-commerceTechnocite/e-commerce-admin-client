import * as React from "react"
import { useHistory } from "react-router-dom"

interface IPreviousProps {}

const Previous: React.FunctionComponent<IPreviousProps> = () => {
  const history = useHistory()
  return (
    <button
      className="action"
      style={{ marginBottom: "15px" }}
      onClick={() => history.goBack()}
    >
      Previous Page
    </button>
  )
}

export default Previous
