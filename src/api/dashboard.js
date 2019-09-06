import request from '@/utils/request'

export function getWeather(params) {
  return request({
    url: '/weather',
    method: 'get',
    params
  })
}

