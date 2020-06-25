<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb />
    
    <div class="right-menu">
       <screenfull id="screenfull" class="right-menu-item hover-effect" />

      <div class="user_name right-menu-item">{{name}}</div>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <router-link class="inlineBlock" to="/pwd" v-if="!this.isErp" >
            <el-dropdown-item >
              修改密码
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">注销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import avatar from "@/assets/pub/avatar.gif";
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  computed: {
    ...mapGetters([
      'name',
      'sidebar',
      // 'avatar',
      'erp'
    ]),
    isErp() {
      return this.erp=="1"
    }
  },
  data(){
    return {
      avatar
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        this.$store.dispatch('FedLogOut').then(() => {
          if(this.erp=="1"){
            window.location= process.env.ERP_LOGOUT_HREF
          }else{
            location.reload() // 为了重新实例化vue-router对象 避免bug
          }
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 45px;
  line-height: 36px;
  line-height: 36px;
  border-radius: 0px !important;
  background-color:#3b3f51;
  .hamburger-container {
    line-height: 50px;
    height: 45px;
    float: left;
    padding: 0 10px;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;
        vertical-align: 12px;
        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    .user_name{
      cursor: pointer;
      vertical-align: 13px;
      font-size:13px;
      color:#94979f;
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
    }
    .avatar-container {
      height: 45px;
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 4px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

