import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/baseinfo/dict/list',
    method: 'get',
    params
  })
}

export function findById(param) {
  return request({
    url: '/baseinfo/dict/find',
    method: 'post',
    data:param
  })
}

export function save(param) {
    return request({
      url: '/baseinfo/dict/save',
      method: 'post',
      data:param
    })
}

export function drop(param) {
    return request({
      url: '/baseinfo/dict/delete',
      method: 'post',
      data:param
    })
}

export function batchSave(param) {
    return request({
      url: '/baseinfo/dict/batch_save',
      method: 'post',
      data:param
    })
}