import * as React from 'react'
import DailyInformations from '../components/dailyInformation/DailyInformations'
import Granted from '../components/Granted'
import GraphicInformation from '../components/graphicInformation/GraphicInformation'
import ProductsList from '../components/product/ProductsList'

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = () => {
  return (
    <div className="home">
      <DailyInformations />
      <GraphicInformation />
      <Granted permissions={['r:product']}>
        <ProductsList number={4} pagination={false} />
      </Granted>
    </div>
  )
}
export default Home
