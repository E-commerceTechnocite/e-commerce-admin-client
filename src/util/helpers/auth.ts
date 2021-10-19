const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh";

export const auth = {
  /**
   * Store a new access token in session storage
   * @param {string} accessToken
   */
  set access(accessToken: string) {
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },

  /**
   * Get the jwt access token
   */
  get access(): string {
    return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Get the decoded jwt access token body
   */
  get decodedAccess(): any {
    return JSON.parse(atob(this.access.split(".")[1]));
  },

  /**
   * Store a new refresh token in session storage
   * @param {string} refreshToken
   */
  set refresh(refreshToken: string) {
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  /**
   * Get the jwt refresh token
   */
  get refresh(): string {
    return window.sessionStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Get the decoded jwt refresh token body
   */
  get decodedRefresh(): any {
    return JSON.parse(atob(this.refresh.split(".")[1]));
  },

  get headers(): { authorization: string } {
    return { authorization: `Bearer ${this.access}` };
  },
};
