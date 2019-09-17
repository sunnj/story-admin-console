import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/sysmgr/att/list',
    method: 'get',
    params
  })
}

export function drop(param) {
  return request({
    url: '/sysmgr/att/delete',
    method: 'post',
    data:param
  })
}
