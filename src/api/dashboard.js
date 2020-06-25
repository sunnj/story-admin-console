import request from '@/utils/request'

// //仪表板数据统计
// export function getDataStatistics(params) {
//   return request({
//     url: '/dashboard/data_statistics',
//     method: 'get',
//     params
//   })
// }


// //获取月度行程人数曲线
// export function getTripMonthLine(params) {
//   return request({
//     url: '/dashboard/trip_month_line',
//     method: 'get',
//     params
//   })
// }

// //旅行社客流占比
// export function getAgentPercentages(params) {
//   return request({
//     url: '/dashboard/agent_percentages',
//     method: 'get',
//     params
//   })
// }

// //待办事项
// export function getTodoList(query) {
//   return request({
//     url: '/dashboard/todo_list',
//     method: 'get',
//     params: query
//   })
// }

//天气预报
export function getWeather(params) {
  return request({
    url: '/dashboard/weather',
    method: 'get',
    params
  })
}

// export function getTripList(query) {
//   return request({
//     url: '/dashboard/trip_list',
//     method: 'get',
//     params: query
//   })
// }


