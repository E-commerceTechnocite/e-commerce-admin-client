import * as React from "react"
import Loading from "../components/Loading"
import { http } from "../util/http"

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  return (
    <>
      <div className="home">This is the Home page</div>
    </>
  )
}
export default Home
