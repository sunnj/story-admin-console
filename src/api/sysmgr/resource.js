import request from '@/utils/request'

export function getList(param) {
    return request({
      url: '/sysmgr/resource/list',
      method: 'post',
      data:param
    })
}

export function save(param) {
  return request({
    url: '/sysmgr/resource/save',
    method: 'post',
    data:param
  })
}

export function drop(param) {
  return request({
    url: '/sysmgr/resource/delete',
    method: 'post',
    data:param
  })
}
