<template>
  <div class="dashboard-container">
    <!--<div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>-->
    <div class="dashboard-text">{{ name }}，你好！</div>
    <div class="dashboard-text">欢迎登陆 STORY-ADMIN </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
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
    margin: 30px;
    text-align: center;
  }
  &-text {
    font-size: 30px;
    line-height: 86px;
  }
}
</style>
