import request from '@/utils/request'

export function getRequest(url, params) {
    return request({
        url: url,
        method: 'get',
        params
    })
}

export function postRequest(url, params) {
    return request({
        url: url,
        method: 'post',
        data: params
    })
}