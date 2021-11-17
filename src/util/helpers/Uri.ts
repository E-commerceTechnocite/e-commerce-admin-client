import { config } from '../../index'

export class Uri extends URL {
  /**
   * Pass domain and custom base uri
   * @param {string} uri
   */
  constructor(uri: string) {
    super(uri, config.api)
  }

  /**
   * Check if value exists then set query to the url
   * @param {string} key
   * @param {string} value
   * @returns
   */
  public setQuery(key: string, value: string) {
    if (value) this.searchParams.set(key, value)
    return this
  }
}

export default Uri
