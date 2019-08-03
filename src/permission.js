import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login','/login_erp'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login' || to.path === '/login_erp'|| to.path === '/admin') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          const menus = res.data.menus;
          var fmtRoutes = formatRoutes(menus);
          router.addRoutes(fmtRoutes);
          store.commit('SET_ROUTERS', fmtRoutes);
          next({ ...to, replace: true })
        }).catch((err) => {
          console.log(err);
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else if (to.path === '/admin') {
      window.location.href=process.env.ERP_LOGIN_HREF;
    }else{
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

export const formatRoutes = (routes)=> {
  let fmRoutes = [];
  routes.forEach(router=> {
    let {
      url,
      label,
      iconClass,
      children,
      component,
    } = router;
   
    if (children && children instanceof Array && children.length>0) {
      children = formatRoutes(children);
    }
    
    let fmRouter = {
      path: url,
      component(resolve){
        require(['./views'+component+'.vue'], resolve)
      },
      name:label,
      meta: {
        title: label,
        icon: iconClass
      },
      children: children
    };

    if (fmRouter.children && !fmRouter.children.length) {
      delete fmRouter["children"];
    }
    fmRoutes.push(fmRouter);
  })
  return fmRoutes;
}