import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}


export function loginerp(sso_service_ticket) {
  var params =null;
  if(sso_service_ticket){
    params = {sso_service_ticket};
  }
  return request({
    url: '/user/valid_erp',
    method: 'post',
    params: params
  })
}

