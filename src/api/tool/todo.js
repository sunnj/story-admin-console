import request from '@/utils/request'

export function getTodoList(params) {
  return request({
    url: '/tool/todo/calendar_list',
    method: 'get',
    params
  })
}

export function findById(param) {
  return request({
    url: '/tool/todo/find',
    method: 'post',
    data:param
  })
}

export function save(param) {
    return request({
      url: '/tool/todo/save',
      method: 'post',
      data:param
    })
}

export function drop(param) {
    return request({
      url: '/tool/todo/delete',
      method: 'post',
      data:param
    })
}
