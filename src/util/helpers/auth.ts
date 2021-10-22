export const ACCESS_TOKEN_KEY = 'token'
export const REFRESH_TOKEN_KEY = 'refresh'
export const PERMISSIONS_KEY = 'permissions'

type entity =
  | 'role'
  | 'product'
  | 'product-category'
  | 'country'
  | 'tax'
  | 'tax-rule'
  | 'tax-rule-group'
  | 'user'
  | 'file'
export type Permission =
  | `r:${entity}`
  | `c:${entity}`
  | `u:${entity}`
  | `d:${entity}`

export const auth = {
  /**
   * Store a new access token in session storage
   * @param {string} accessToken
   */
  set access(accessToken: string) {
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  },

  /**
   * Get the jwt access token
   */
  get access(): string {
    return window.sessionStorage.getItem(ACCESS_TOKEN_KEY)
  },

  /**
   * Get the decoded jwt access token body
   */
  get decodedAccess(): any {
    return JSON.parse(atob(this.access.split('.')[1]))
  },

  /**
   * Store a new refresh token in session storage
   * @param {string} refreshToken
   */
  set refresh(refreshToken: string) {
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  /**
   * Get the jwt refresh token
   */
  get refresh(): string {
    return window.sessionStorage.getItem(REFRESH_TOKEN_KEY)
  },

  /**
   * Get the decoded jwt refresh token body
   */
  get decodedRefresh(): any {
    return JSON.parse(atob(this.refresh.split('.')[1]))
  },

  get headers(): { authorization: string } {
    return { authorization: `Bearer ${this.access}` }
  },

  get permissions(): Permission[] {
    return JSON.parse(window.sessionStorage.getItem(PERMISSIONS_KEY))
  },

  set permissions(permissions: Permission[] | string) {
    if (Array.isArray(permissions)) {
      permissions = JSON.stringify(permissions)
    }
    window.sessionStorage.setItem(PERMISSIONS_KEY, permissions)
  },

  hasEachPermissions(permissions: Permission[]): boolean {
    const actualPermissions = this.permissions
    return actualPermissions
      ? permissions.every((permission) =>
          actualPermissions.includes(permission)
        )
      : null
  },

  hasOneOfPermissions(permissions: Permission[]): boolean {
    const actualPermissions = this.permissions
    return actualPermissions
      ? permissions.some((permission) => actualPermissions.includes(permission))
      : null
  },

  clearSession() {
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY)
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    window.sessionStorage.removeItem(PERMISSIONS_KEY)
  },
}
