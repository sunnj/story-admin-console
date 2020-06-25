import request from '@/utils/request'

export function rewrite(param) {
    return request({
      url: '/sysmgr/config/rewrite',
      method: 'post',
      data:param
    })
}
