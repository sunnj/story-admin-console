import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/login_erp', component: () => import('@/views/login/erpIndex'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/pwd',
    component: Layout,
    redirect: '/pwd/edit',
    hidden:true,
    children: [
    {
      path: 'edit',
      component: () => import('@/views/sysmgr/user/editpassword'),
      name: '修改密码',
      meta: { title: '修改密码', icon: 'edit', noCache: true }
    }]
  },
  {
    path: '/calendar',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tools/calendar'),
        name: '待办事项',
        meta: { title: '待办事项', icon: 'table', noCache: true }
      }
    ]
  },
]

export default new Router({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
