import * as React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '../../util/hook/useQuery'
import './legend.scss'

interface ILegendProps {
  uri: string
  name: string
  search: string
  customQuery?: string
  customSearch?: string
  customOrder?: string
}

const Legend: React.FunctionComponent<ILegendProps> = ({
  uri,
  name,
  search,
  customQuery,
  customSearch,
  customOrder,
}) => {
  const query = useQuery()
  const queryParam = `${customQuery ? customQuery : `page=1`}`
  const querySearch = `${customSearch ? customSearch : `search`}`
  const queryOrder = `${customOrder ? customOrder : `order`}`
  return (
    <span className="legend-item">
      {!query.get(querySearch) && !query.get(queryOrder) && (
        <Link
          to={`${uri}?${queryParam}&s=u&${querySearch}=${search}&${queryOrder}=DESC`}
        >
          {name}
        </Link>
      )}
      {query.get(querySearch) && query.get(querySearch) !== search && (
        <Link
          to={`${uri}?${queryParam}&s=u&${querySearch}=${search}&${queryOrder}=DESC`}
        >
          {name}
        </Link>
      )}
      {query.get(querySearch) === search && query.get(queryOrder) == 'ASC' && (
        <Link
          to={`${uri}?${queryParam}&s=u&${querySearch}=${search}&${queryOrder}=DESC`}
        >
          {name}
          <i className="fas fa-sort-up up" />
        </Link>
      )}
      {query.get(querySearch) === search && query.get(queryOrder) == 'DESC' && (
        <Link
          to={`${uri}?${queryParam}&s=u&${querySearch}=${search}&${queryOrder}=ASC`}
        >
          {name}
          <i className="fas fa-sort-down down" />
        </Link>
      )}
    </span>
  )
}

export default Legend
