import request from '@/utils/request'

export function getTripImportTemp(params) {
  return request({
    url: '/pub/combo/trip_import_temp',
    method: 'post',
    data:params
  })
}
