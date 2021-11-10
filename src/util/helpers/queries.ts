import { useQuery } from '../hook/useQuery'
const param = () => {
  const query = useQuery()
  return {
    page: query.get('page') ? `?page=${query.get('page')}` : '?page=1',
    search: query.get('search') ? `&search=${query.get('search')}` : '',
    searchGroup: query.get('searchGroup') ? `&searchGroup=${query.get('searchGroup')}` : '',
    searchCountry: query.get('searchCountry') ? `&searchCountry=${query.get('searchCountry')}` : '',
    order: query.get('order') ? `&order=${query.get('order')}` : '',
    orderGroup: query.get('orderGroup') ? `&orderGroup=${query.get('orderGroup')}` : '',
    orderCountry: query.get('orderCountry') ? `&order=${query.get('orderCountry')}` : '',
    q: query.get('q') ? `&q=${query.get('q')}` : '',
  }
}
export default param
