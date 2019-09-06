<template>
<div>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">New Visits</div>
          <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Messages</div>
          <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Purchases</div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Shoppings</div>
          <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
  </el-row>
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
</div>
</template>

<script>
import { getWeather } from "@/api/dashboard"
import { parseTime } from '@/utils'
import CountTo from 'vue-count-to'
export default {
  components: {CountTo},
  filters: {
    parseTime
  },
  data() {
    return {
      weather:{}
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
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
  },
  mounted() {
    this.showWeather();
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-title{
    margin:0px 10px 6px 10px;padding-left:10px;text-align:left;font-size:16px;font-weight:600;color: rgba(0, 0, 0, 0.75);
  }
  .card-panel-col{
    margin-bottom: 22px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
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
      background-color:#ddd;
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

  
}
</style>
