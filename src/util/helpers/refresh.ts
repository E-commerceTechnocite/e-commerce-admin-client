import { config } from '../../index'
import { http, HttpException, HttpReturnValue } from '../http'
import { auth } from './auth'

const refresh = async (): Promise<HttpException | null> => {
  const refresh_token = auth.refresh
  const options = {
    headers: { 'Content-Type': 'application/json' },
  }
  const { data, error } = await http.post<{
    access_token: string
    refresh_token: string
  }>(`${config.api}/v1/o-auth/refresh`, { refresh_token }, options)

  if (error) {
    const keysToRemove = ['token', 'refresh']
    keysToRemove.forEach((key) => sessionStorage.removeItem(key))
    return error
  }

  const { access_token, refresh_token: refresh } = data
  auth.access = access_token
  auth.refresh = refresh
  return error
}

export const sendRequest = async <T>(
  req: (data?: any, id?: string) => Promise<HttpReturnValue<T>>,
  data?: any,
  id?: string
): Promise<HttpReturnValue<T>> => {
  const decodedToken = auth.decodedAccess
  const isExpired = Math.round(Date.now() / 1000) > decodedToken.exp
  let res: HttpReturnValue<T>
  if (!isExpired) {
    res = await req(data, id)
  }
  if (isExpired || (res.error && res.error.statusCode === 401)) {
    await refresh()
    res = await req(data, id)
  }
  return res
}

export default refresh
