import { constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param functions
 * @param route
 */
function hasPermission(functions, route) {
  if (route.meta && route.meta.functions) {
    return functions.some(func => route.meta.functions.indexOf(func) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param functions
 */
// function filterAsyncRouter(asyncRouterMap, functions) {
//   const accessedRouters = asyncRouterMap.filter(route => {
//     if (hasPermission(functions, route)) {
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children, roles)
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    btns: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers =constantRouterMap.concat(routers)
    },
    SET_BTNS: (state, btns) => {
      state.btns = btns
    }
  },
  actions: {
    // GenerateRoutes({ commit }, data) {
    //   return new Promise(resolve => {
    //     const { functions } = data
    //     let accessedRouters
    //     // if (roles.indexOf('admin') >= 0) {
    //     //   accessedRouters = asyncRouterMap
    //     // } else {
    //       accessedRouters = filterAsyncRouter(asyncRouterMap, functions)
    //     // }
    //     commit('SET_ROUTERS', accessedRouters)
    //     resolve()
    //   })
    // },
    initMenu(state, menus){
      state.routes = menus;
    }
  }
}

export default permission
