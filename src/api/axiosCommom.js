import request from '@/utils/request'
const qs = require('qs')
export function getRequest(url, params) {
    return request({
        url: url,
        method: 'get',
        params:params,
        paramsSerializer:params => {
        return qs.stringify(params,{indices:false,skipNulls: true})
        }
    })
}

export function postRequest(url, params) {
    return request({
        url: url,
        method: 'post',
        data: params
    })
}