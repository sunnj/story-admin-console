<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { getAgentPercentages } from "@/api/dashboard"
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      nameList:[],
      dataList:[]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    loadData(){
      getAgentPercentages().then(res => {
        //旅行社占比
        this.nameList = res.data.map(function (item) {
          return item.travelAgencyName;
        });
        this.dataList = res.data.map(function (item) {
          return {
            name:item.travelAgencyName,
            value:item.perNumber
          };
        });
        //初始化图表
        this.initChart();
      });
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.nameList
        },
        series: [
          {
            name: '旅行社占比',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.dataList,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
