import * as React from 'react'
import DailyInformations from '../components/DailyInformations'
import GraphicInformation from '../components/GraphicInformation'
import ProductsList from '../components/ProductsList'

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = () => {
  return (
    <div className="home">
      <DailyInformations />
      <GraphicInformation />
      <ProductsList number={4} pagination={false} />
    </div>
  )
}
export default Home
