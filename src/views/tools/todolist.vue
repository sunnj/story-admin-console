<template>
  <div class="app-container lunarFullCalendar">
    <!-- <full-calendar :events="events" class="test-fc" lang='zh'
            first-day='1' locale="fr"
            @changeMonth="changeMonth"    
            @eventClick="eventClick"      
            @dayClick="dayClick"         
            @moreClick="moreClick"></full-calendar> -->
    <lunar-full-calendar :events="events" 
      ref="calendar"
      :config="config"
      @event-selected="eventClick"
      @day-click="dayClick"></lunar-full-calendar>

    <el-dialog title="任务详情" :visible.sync="modifyVisible">
      <el-form :model="taskForm" :rules="rules" ref="taskForm" label-width="70px"  label-position="right" style="width: 400px; margin-left:50px;">
        <el-form-item label="日期" prop="taskDate" size="medium">
          <el-date-picker
            v-model="taskDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="标题" prop="title" >
          <el-input v-model="taskForm.title" placeholder="请输入标题..." style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="样式" prop="level" >
          <el-select v-model="taskForm.level" class="filter-item" placeholder="请选择...">
            <el-option v-for="item in levelOptions" :key="item.key" :label="item.key" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="链接" prop="url" >
          <el-input v-model="taskForm.url" placeholder="请输入链接..." style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="taskContent" >
          <el-input v-model="taskForm.taskContent" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" style="width:400px" placeholder="请输入..."></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dropEvent" v-if="taskForm.id">删除</el-button>
        <el-button @click="modifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>


import { LunarFullCalendar } from 'vue-lunar-full-calendar'
import { getTodoList,save,findById,drop} from "@/api/tool/todo";
import { parseTime } from '@/utils'

const levelOptions=[{'key':'工作','value':1},{'key':'会议','value':2}, 
{'key':'约会/聚会','value':3},{'key':'旅行','value':4},{'key':'小组学习/分享','value':5}]

const levelTypeKeyValue = levelOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.key
  return acc
}, {})
export default {
  components: {
    LunarFullCalendar
  },
  data() {
    let self = this
    return {
      events: [],
      config:{
        // lunarCalendar
        // Control whether the Chinese calendar shows true, unrealistic flase, default true.（lunarCalendar控制是否显示中国农历、显示的为true，隐藏为flase，默认为true）
        lunarCalendar: true,
        // height: 'parent',
        locale: 'zh-cn',
        buttonText: {
          today: '今天',
          month: '月',
          week: '周',
          day: '日'
        },
        header: {
          left: 'prev,next, today',
          center: 'title',
          right: 'hide, custom, month,agendaWeek,agendaDay'
        },
        // eventOrder:'index',   // 这个是控制事件排序的功能，意思是 按照字段 事件数据中index来排序
        // eventLimitClick: 'day', //点击今天日列表图
        eventLimit: true, // 一天中显示多少条事件，多了隐藏
        firstDay: 0, // 控制周一周日那个在前面
        defaultView: 'month',
        allDaySlot: true, // agenda视图下是否显示all-day
        allDayText: '全天', // agenda视图下all-day的显示文本
        timezone: 'local', // 时区默认本地的
        slotLabelFormat: 'HH:mm', // 周视图和日视同的左侧时间显示
        viewRender (view, element) {
          self.viewRender(view, element)
        },
        customButtons: { // 新增按钮
          hide: {
            text: '隐藏农历',
            click: function () {
              self.$refs.calendar.fireMethod('option', {
                lunarCalendar: false
              })
              self.$refs.calendar.fireMethod('option', {
                header: {
                  left: 'prev,next, today',
                  center: 'title',
                  right: 'show, custom, month,agendaWeek,agendaDay'
                }
              })
            }
          },
          show: {
            text: '显示农历',
            click: function () {
              self.$refs.calendar.fireMethod('option', {
                lunarCalendar: true
              })
              self.$refs.calendar.fireMethod('option', {
                header: {
                  left: 'prev,next, today',
                  center: 'title',
                  right: 'hide, custom, month,agendaWeek,agendaDay'
                }
              })
            }
          }
        }
      },



      levelOptions:levelOptions,
      selectMonth:{
        start:"",
        end:"",
        // current:""
      },


      modifyVisible:false,
      taskDate:[],
      taskForm:{
        id:null,
        start:null,
        end:null,
        title:null,
        level:null,
        url:null,
        taskContent:null
      },
      rules:{title: [{ required: true, message: '标题是必填项', trigger: 'blur' }]},
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  watch: {
    modifyVisible(val) {
      if(!val){
        this.taskForm.id=null;
        this.taskForm.start= null;
        this.taskForm.end=null;
        this.taskForm.title=null;
        this.taskForm.level=null;
        this.taskForm.url=null;
        this.taskForm.taskContent= null;
      }
    }
  },
  methods: {
    // 选择月份
    // changeMonth (start, end, current) {
    //   this.selectMonth.start= start;
    //   this.selectMonth.end= end;
    //   // this.selectMonth.current= current;
    //   this.loadTodoList();
    // },
    // 点击事件
    eventClick (event, jsEvent, view) {
      this.modifyVisible=true;
      let params={
        id:event.id
      }
      findById(params).then((res) => {
        if(res.result){
          this.taskForm.id= res.data.id;
          this.taskForm.start= res.data.start;
          this.taskForm.end= res.data.end;
          this.taskForm.title=res.data.title;
          this.taskForm.level=res.data.level;
          this.taskForm.url= res.data.url;
          this.taskForm.taskContent= res.data.taskContent;
          this.taskDate=[new Date(Date.parse(res.data.start.replace(/-/g,  "/"))),new Date(Date.parse(res.data.end.replace(/-/g,  "/")))];
        }else{
          _this.$message.error(res.code);
        }
      });
    },
    // 点击当天
    dayClick (date, jsEvent,view) {
      this.modifyVisible=true;
      // let end= new Date(day.valueOf())
      // end.setHours(23);
      // end.setMinutes(59);
      // end.setSeconds(59);
      this.taskDate=[date.format("YYYY-MM-DD 00:00:00"),date.format("YYYY-MM-DD 23:59:59")];
    },
    viewRender (view, element) {
      // console.log(view, element, 'viewRender')
      this.selectMonth.start= view.start.format("YYYY-MM-DD");
      this.selectMonth.end= view.end.format("YYYY-MM-DD");
      // this.selectMonth.current= current;
      this.loadTodoList();
    },
    // 查看更多
    moreClick (day, events, jsEvent) {
      console.log('moreCLick', day, events, jsEvent)
    },
    loadTodoList(){
      let _this=this;
      var params={
        start:this.selectMonth.start+" 00:00:00",
        end:this.selectMonth.end + " 23:59:59"
      };
      getTodoList(params).then((res) => {
        if(res.result){
          let dataList=[];
          res.data.forEach(element => {
            dataList.push({
              id:element.id,
              title : element.title,
              start : element.start,
              end : element.end,
              backgroundColor: _this.getColor(element.level),
              borderColor: _this.getColor(element.level)
            })
          });
          _this.events=dataList;
        }else{
          _this.$message.error(res.code);
        }
      });
    },
    getColor(level){
      switch(level){
        case 1:
          return "#dd4b39";
        case 2:
          return "#3c8dbc";
        case 3:
          return "#00c0ef";
        case 4:
          return "#f39c12"
        case 5:
          return "#00a65a";
        default:
          return null;
      }
    },
    submitForm(){
      this.taskForm.start= this.taskDate[0];
      this.taskForm.end= this.taskDate[1];
      this.$refs["taskForm"].validate((valid) => {
        if (valid) {
				  let para = this.taskForm;
			    save(para).then((res) => {
				    this.modifyVisible = false
            this.loadTodoList();
			  	});
        } else {
          return false;
        }
      });
    },
    dropEvent(){
      let _this=this;
      this.$confirm('您确定要删除该数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
          let params={};
          if(_this.taskForm.id){
            params.id= _this.taskForm.id;
            drop(params).then((res) => {
              _this.loadTodoList();
              this.modifyVisible=false;
            });
          }
				}).catch(() => {
      });
    }
  }
}
</script>

<style>
/* .comp-full-calendar {
    max-width:inherit;
}
.full-calendar-header .header-center{
  display: inline-block;
}
.full-calendar-header .header-center .prev-month, .full-calendar-header .header-center .next-month{
  padding: 0px 20px;
  border: 1px solid #e0e0e0;
}
.full-calendar-header .header-center .title{
  width:300px;
}

.full-calendar-body .weeks{
  border-top-left-radius:5px;
  border-top-right-radius:5px;
  border-right: 1px solid #e0e0e0;
}

.full-calendar-body .weeks .week{
  padding:10px 0px;
}
.full-calendar-body .weeks .week:last-child{
  border-right: none;
} */

/* event level background-color */
.full-calendar-body .dates .dates-events .events-week .events-day .event-box .level_1 {
  background: #dd4b39;
}
.full-calendar-body .dates .dates-events .events-week .events-day .event-box .level_2 {
  background: #3c8dbc;
}
.full-calendar-body .dates .dates-events .events-week .events-day .event-box .level_3 {
  background: #00c0ef;
}
.full-calendar-body .dates .dates-events .events-week .events-day .event-box .level_4 {
  background: #f39c12;
}
.full-calendar-body .dates .dates-events .events-week .events-day .event-box .level_5 {
  background: #00a65a;
}
</style>


<style scoped lang="scss">
$color: #45b984;
.lunarFullCalendar {
  min-width: 900px;
  height: 100%;
  background: #fff;
  //   .top {
  //     height: 100px;
  //     h2 {
  //       text-align: center;
  //       font-size: 15px;
  //     }
  //     div {
  //       font-size: 13px;
  //     }
  //   }
  .full-calendar {
    padding: 20px;
    height: calc(100% - 30px);
    /deep/ {
      .fc-unthemed thead,
      .fc-unthemed .fc-content,
      .fc-unthemed th,
      .fc-unthemed td,
      .fc-unthemed tbody,
      .fc-unthemed .fc-row,
      .fc-unthemed .fc-list-view,
      .fc-unthemed .fc-popover,
      .fc-unthemed .fc-divider,
      .fc-unthemed .fc-list-heading td {
        border-color: #eaecf1;
      }
      .fc-header-toolbar {
        height: 30px;
        margin-bottom: 0;
        line-height: 30px;
        h2 {
          font-size: 24px;
          color: #000;
        }
      }
      .fc-button {
        height: 30px;
        background: #fff;
        border-color: #fff;
        box-shadow: none;
        padding: 0;
      }
      .fc-today-button {
        font-size: 15px;
        color: $color;
      }
      .fc-show-button,
      .fc-hide-button {
        position: relative;
        width: 80px;
        border: 1px solid #bbbfcd;
        border-radius: 20px;
        font-size: 15px;
        color: #000;
      }
      .fc-next-button,
      .fc-prev-button {
        color: #7d8292;
      }
      .fc-button-group {
        margin-left: 20px;
        font-size: 15px;
        button {
          width: 80px;
          color: #000;
          border: 1px solid #bbbfcd;
        }
        button:first-child {
          border-top-left-radius: 20px;
          border-bottom-left-radius: 20px;
        }
        button:last-child {
          border-top-right-radius: 20px;
          border-bottom-right-radius: 20px;
        }
        .fc-state-active {
          background: $color;
          color: #fff;
          text-shadow: none;
        }
      }
      .fc-agendaDay-view,
      .fc-month-view,
      .fc-agendaWeek-view {
        .fc-widget-content {
          .fc-sun,
          .fc-sat {
            background: rgba(245, 246, 248, 0.6);
          }
          .fc-day-number {
            font-size: 15px;
            letter-spacing: 0;
            line-height: 13px;
            float: left;
          }
          .fc-day-top {
            padding: 15px 12px 0 12px;
          }
          .fc-day-cnTerm,
          .fc-day-cnDate {
            font-size: 12px;
            color: #7d8292;
            float: right;
          }
          .fc-more {
            font-size: 12px;
            color: #7d8292;
          }
          .fc-event {
            cursor: pointer;
            font-size: 12px;
            color: #000;
            background-color: rgba($color: $color, $alpha: 0.15) !important;
            border: 1px solid rgba($color: $color, $alpha: 0.15) !important;
            border-left: 2px solid rgba($color: $color, $alpha: 0.15) !important;
            border-radius: 0;
          }
          .fc-day-grid-event {
            padding: 1px 0 1px 5px;
          }
        }
      }
      .fc-agendaWeek-view,
      .fc-agendaDay-view {
        .fc-axis {
          font-size: 15px;
        }
        .fc-title {
          font-size: 15px;
          color: $color;
        }
      }
      .fc-month-view {
        .fc-event {
          &.fc-not-start {
            border-left: 1px solid rgba($color: $color, $alpha: 0.1) !important;
          }
        }
      }
      .fc-agendaDay-view {
        .fc-head {
          table {
            margin: 15px 0;
          }
          .fc-day-header {
            display: none;
          }
        }
      }
      .fc-head {
        .fc-day-header,
        .fc-widget-header,
        .fc-head-container {
          border-top-color: #fff;
          border-left-color: #fff;
          border-right-color: #fff;
        }
        table {
          margin: 10px 0 15px 0;
          font-size: 15px;
          color: #000;
        }
      }
    }
  }
}
.tip {
  color: $color;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}
</style>
