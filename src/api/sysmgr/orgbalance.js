import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/sysmgr/orgbalance/list',
    method: 'get',
    params
  })
}

export function findById(param) {
  return request({
    url: '/sysmgr/orgbalance/find',
    method: 'post',
    data:param
  })
}

export function save(param) {
  return request({
    url: '/sysmgr/orgbalance/save',
    method: 'post',
    data:param
  })
}

export function drop(param) {
  return request({
    url: '/sysmgr/orgbalance/delete',
    method: 'post',
    data:param
  })
}