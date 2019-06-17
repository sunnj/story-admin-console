import request from '@/utils/request'

export function getList(param) {
    return request({
      url: '/sysmgr/authority/list',
      method: 'post',
      data:param
    })
}

export function save(param) {
  return request({
    url: '/sysmgr/authority/save',
    method: 'post',
    data:param
  })
}

export function drop(param) {
  return request({
    url: '/sysmgr/authority/delete',
    method: 'post',
    data:param
  })
}