<template>
  <div class="dashboard-container">
    <div class="dashboard-text">{{ name }}，你好！</div>
    <div class="dashboard-text">欢迎登陆 Story Admin </div>
    <component :is="currentRole"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'

export default {
  name: 'dashboard',
  components: { adminDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px 20px;
    text-align: center;
  }
  &-text {
    font-size: 30px;
    line-height: 86px;
  }
}
</style>
