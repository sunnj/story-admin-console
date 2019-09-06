import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/sysmgr/schedulejob/list',
    method: 'get',
    params
  })
}

export function findById(param) {
  return request({
    url: '/sysmgr/schedulejob/find',
    method: 'post',
    data:param
  })
}

export function save(param) {
    return request({
      url: '/sysmgr/schedulejob/save',
      method: 'post',
      data:param
    })
}

export function drop(param) {
    return request({
      url: '/sysmgr/schedulejob/delete',
      method: 'post',
      data:param
    })
}

export function getJobCombo(params) {
  return request({
    url: '/sysmgr/schedulejob/job-options',
    method: 'get',
    params
  })
}
