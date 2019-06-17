'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://localhost:9430"',
  ERP_LOGIN_HREF: '"http://test.***.com/sso/login?ReturnUrl=http://localhost:9428/login_erp"',
  ERP_LOGOUT_HREF: '"http://test.***.com/sso/logout?ReturnUrl=http://localhost:9428/"'
})
