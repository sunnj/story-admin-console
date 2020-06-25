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

export function queryDictCombo(codes) {
  return queryDict(codes,'/baseinfo/dict/find_dicts')
}

export function queryGroupDictCombo(codes) {
  return queryDict(codes,'/baseinfo/dict/find_group_dicts')
}

function queryDict(codes, uri){
  var param = null;
  if(codes instanceof Array){
    param = {"code":codes.join(",")}
  }else{
    param={"code":codes}
  }
  return request({
    url: uri,
    method: 'post',
    data:param
  })
}

