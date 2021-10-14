import * as React from "react"
import { Link } from "react-router-dom"
import DailyInformations from "../components/DailyInformations"
import GraphicInformation from "../components/GraphicInformation"
import Loading from "../components/loading/Loading"
import ProductsList from "../components/ProductsList"
import { http } from "../util/http"

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = () => {

  return (
    <div className="home">
      <DailyInformations />
      <GraphicInformation />
      <ProductsList  number={4} pagination={false}/>
    </div>
  )
}
export default Home
