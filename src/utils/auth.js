import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const SSOTokenKey='sso.***.com'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  if(getERPToken(SSOTokenKey)){
    Cookies.remove(SSOTokenKey)
  }
  return Cookies.remove(TokenKey)
}

export function getERPToken() {
  return Cookies.get(SSOTokenKey)
}
