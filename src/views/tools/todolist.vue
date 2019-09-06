<template>
  <div>
    <full-calendar :events="monthData" class="test-fc" lang='zh'
            first-day='1' locale="fr"
            @changeMonth="changeMonth"    
            @eventClick="eventClick"      
            @dayClick="dayClick"         
            @moreClick="moreClick"></full-calendar>

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

import { getTodoList,save,findById,drop} from "@/api/tool/todo";
import { parseTime } from '@/utils'

const levelOptions=[{'key':'工作','value':'1'},{'key':'会议','value':'2'}, 
{'key':'约会/聚会','value':'3'},{'key':'旅行','value':'4'},{'key':'小组学习/分享','value':'5'}]

const levelTypeKeyValue = levelOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.key
  return acc
}, {})
export default {
  components: {
    'full-calendar': require('vue-fullcalendar')
  },
  data() {
    return {
      levelOptions:levelOptions,
      selectMonth:{
        start:"",
        end:"",
        current:""
      },
      monthData: [],
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
    changeMonth (start, end, current) {
      this.selectMonth.start= start;
      this.selectMonth.end= end;
      this.selectMonth.current= current;
      this.loadTodoList();
    },
    // 点击事件
    eventClick (event, jsEvent, pos) {
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
    dayClick (day, jsEvent) {
      this.modifyVisible=true;
      let end= new Date(day.valueOf())
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
      this.taskDate=[parseTime(day,'{y}-{m}-{d} {h}:{i}:{s}'),parseTime(end,'{y}-{m}-{d} {h}:{i}:{s}')];
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
              cssClass: _this.getClass(element.level)
            })
          });
          _this.monthData=dataList;
        }else{
          _this.$message.error(res.code);
        }
      });
    },
    getClass(level){
      if(level!=""){
        return "level_"+level
      }
      return "";
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
.comp-full-calendar {
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
}

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