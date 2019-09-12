import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/sysmgr/syslog/list',
    method: 'get',
    params
  })
}

export function findById(param) {
  return request({
    url: '/sysmgr/syslog/find',
    method: 'post',
    data:param
  })
}
