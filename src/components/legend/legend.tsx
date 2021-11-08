import * as React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '../../util/hook/useQuery'
import './legend.scss'

interface ILegendProps {
  uri?: string
  name?: string
  search?: string
}

const Legend: React.FunctionComponent<ILegendProps> = ({
  uri,
  name,
  search,
}) => {
  const query = useQuery()
  return (
    <div className="legend-item">
      <span>
        {!query.get('search') && !query.get('order') && (
          <Link to={`${uri}?page=1&s=u&search=${search}&order=DESC`}>
            {name}
          </Link>
        )}
        {query.get('search') && query.get('search') !== search && (
          <Link to={`${uri}?page=1&s=u&search=${search}&order=DESC`}>
            {name}
          </Link>
        )}
        {query.get('search') === search && query.get('order') == 'ASC' && (
          <Link to={`${uri}?page=1&s=u&search=${search}&order=DESC`}>
            {name}
            <i className="fas fa-sort-up up" />
          </Link>
        )}
        {query.get('search') === search && query.get('order') == 'DESC' && (
          <Link to={`${uri}?page=1&s=u&search=${search}&order=ASC`}>
            {name}
            <i className="fas fa-sort-down down" />
          </Link>
        )}
      </span>
    </div>
  )
}

export default Legend
