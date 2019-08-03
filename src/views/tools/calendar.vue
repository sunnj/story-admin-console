<template>
    <div>
    <full-calendar :events="monthData" class="test-fc"
            first-day='1' locale="fr"
            @changeMonth="changeMonth"    
            @eventClick="eventClick"      
            @dayClick="dayClick"         
            @moreClick="moreClick"></full-calendar>    // 点击 more, 展示当天所有事件，可自己定义事件
    </div>
</template>

<script>
export default {
  data() {
      return {
        monthData: [
            {
                title : 'eeeeeeeee',  // 事件内容
                start : '2019-07-11', // 事件开始时间
                end : '2019-07-30',   // 事件结束时间
                cssClass: 'red'       // 事件的样式   class名（由后台返回数据）  red为自己定义的class名
            },
            {
                title : 'sssss',
                start : '2019-07-25',
                end : '2019-07-30',
                cssClass: 'blue'  
            },
            {
                title : 'dddddddd',
                start : '2019-07-09',
                end : '2019-07-30',
                cssClass: 'blue'  
            },
            {
                title : 'cccccc',
                start : '2019-07-20',
                end : '2019-07-30',
                cssClass: 'red'  
            },
            {
                title : 'aaaaaa',
                start : '2019-07-01',
                end : '2019-07-30',
                cssClass: 'red'  
            },
            {
                title : 'bbbbbb',
                start : '2019-07-05',
                end : '2019-1-10',
                cssClass: 'blue'
            }
        ]
      }
  },
  methods: {
     // 选择月份
      changeMonth (start, end, current) {
      //  console.log('changeMonth', start.format(), end.format(), current.format())
      },
      // 点击事件
      eventClick (event, jsEvent, pos) {
        console.log('eventClick', event, jsEvent, pos)
      },
      // 点击当天
      dayClick (day, jsEvent) {
         console.log('dayClick', day, jsEvent)
      },
      // 查看更多
      moreClick (day, events, jsEvent) {
        console.log('moreCLick', day, events, jsEvent)
      },
  },
  components: {
      'full-calendar': require('vue-fullcalendar')
  }
}
</script>


<style>
.red {
  background: red;
}
.blue {
  background: blue;
}
</style>