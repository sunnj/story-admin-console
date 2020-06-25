import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/sysmgr/org/list',
    method: 'get',
    params
  })
}

export function findById(param) {
  return request({
    url: '/sysmgr/org/find',
    method: 'post',
    data:param
  })
}

export function save(param) {
  return request({
    url: '/sysmgr/org/save',
    method: 'post',
    data:param
  })
}

export function drop(param) {
  return request({
    url: '/sysmgr/org/delete',
    method: 'post',
    data:param
  })
}

export function queryOrgCombo(param) {
  return request({
    url: '/sysmgr/org/combo',
    method: 'post',
    data:param
  })
}