import * as React from "react"
import DailyInformations from "../components/DailyInformations"
import GraphicInformation from "../components/GraphicInformation"
import Loading from "../components/Loading"
import { http } from "../util/http"

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  return (
      <div className="home">
        <DailyInformations/>
        <GraphicInformation/>
        <div className="productButtonContainer">
            <h4>Last products added</h4>
            <button className="action">PRODUCT+</button>
        </div>
      </div>
  )
}
export default Home
