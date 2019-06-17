import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/sysmgr/user/list',
    method: 'get',
    params
  })
}

export function findById(param) {
  return request({
    url: '/sysmgr/user/find',
    method: 'post',
    data:param
  })
}

export function save(param) {
    return request({
      url: '/sysmgr/user/save',
      method: 'post',
      data:param
    })
}

export function drop(param) {
    return request({
      url: '/sysmgr/user/delete',
      method: 'post',
      data:param
    })
}

//查询用户ID的角色
export function findUserRole(param) {
  return request({
    url: '/sysmgr/user/findUserRole',
    method: 'post',
    data:param
  })
}

//保存用户角色
export function saveUserRole(param) {
  return request({
    url: '/sysmgr/user/saveUserRole',
    method: 'post',
    data:param
  })
}

//修改密码
export function editpassword(param) {
    return request({
      url: '/sysmgr/user/editpassword',
      method: 'post',
      data:param
    })
}
