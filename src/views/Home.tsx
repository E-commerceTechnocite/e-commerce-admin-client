import * as React from "react"
import { Link } from "react-router-dom"
import DailyInformations from "../components/DailyInformations"
import GraphicInformation from "../components/GraphicInformation"

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = () => {

  return (
    <div className="home">
      <DailyInformations />
      <GraphicInformation />
      <div className="productButtonContainer">
        <h4>Last products added</h4>
        <Link to="/products/add" className="action">
          New Product
        </Link>
      </div>
    </div>
  )
}
export default Home
