import request from '@/utils/request'

export function getList(params) {
    return request({
      url: '/sysmgr/role/list',
      method: 'get',
      params
    })
}

export function findById(param) {
  return request({
    url: '/sysmgr/role/find',
    method: 'post',
    data:param
  })
}

export function save(param) {
    return request({
      url: '/sysmgr/role/save',
      method: 'post',
      data:param
    })
}

export function drop(param) {
  return request({
    url: '/sysmgr/role/delete',
    method: 'post',
    data:param
  })
}

// 授权
export function modifyAuth(param) {
  return request({
    url: '/sysmgr/role/modifyAuth',
    method: 'post',
    data:param
  })
}

//查询角色Id的权限
export function findRoleAuth(param) {
  return request({
    url: '/sysmgr/role/findRoleAuth',
    method: 'post',
    data:param
  })
}

//查询所有角色
export function findAllRoleList(param) {
  return request({
    url: '/sysmgr/role/listall',
    method: 'post',
    data:param
  })
}




