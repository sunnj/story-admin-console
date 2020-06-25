<template>
  <!-- Weather -->
  <el-row :gutter="20" class="panel-group">
    <div class="card-title">{{weather.city}}天气</div>
    <el-col :xs="12" :sm="12" :lg="(index<3?4:3)" class="card-panel-col" v-for="(item,index) in weather.dateList" :key="index" :label="item" >
      <div class="wea-panel" >
        <div :class="'wea-panel-icon-wrapper'+(index<3?' float-left':'')">
          <img :src="item.weaImg" :alt="item.wea">
        </div>
        <div class="wea-panel-description" v-if="index<3">
          <div class="wea-panel-date">{{item.date | parseTime('{m}-{d}')}}</div>
          <div class="wea-panel-text">{{item.wea}}</div>
          <div class="wea-panel-text">{{item.tem2}} - {{item.tem1}}</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>

import { getWeather } from "@/api/dashboard"
import { parseTime } from '@/utils'
export default {
  filters: {
    parseTime
  },
  props: {
    // className: {
    //   type: String,
    //   default: 'chart'
    // }
  },
  data() {
    return {
      weather: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.showWeather()
    })
  },
  // beforeDestroy() {
  //   if (!this.chart) {
  //     return
  //   }
  //   this.chart.dispose()
  //   this.chart = null
  // },
  methods: {
    showWeather() {
      let _this = this;
      // this.treeloading = true;
      getWeather().then(res => {
        res.data.dateList.forEach(element => {
          element.weaImg=require('@/assets/weather/'+element.weaImg+'.png')
        });
        _this.weather= res.data;
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .card-title{
    margin:0px 10px 6px 10px;padding-left:10px;text-align:left;font-size:16px;font-weight:600;color: rgba(0, 0, 0, 0.75);
  }
  .float-left{
    float: left;
  }
  .wea-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(241, 221, 221, 0.05);
    .wea-panel-icon-wrapper {
      padding:3px;
      margin: 10px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      img{
        width: 80px;
      }
    }
    .wea-panel-description {
      float:left;
      font-weight: bold;
      margin: 16px 0px 0px 0px;
      .wea-panel-date {
        line-height: 28px;
        color: rgba(0, 0, 0, 0.75);
        font-size: 14px;
        // margin-bottom: 12px;
      }
      .wea-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
        // margin-bottom: 12px;
      }
      .wea-panel-num {
        font-size: 20px;
      }
    }
  }
</style>
