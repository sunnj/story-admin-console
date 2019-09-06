<template>
  <div class="app-container">

    <data-grid url="/sysmgr/schedulejob/list" dataName="listQuery" ref="dataList" @dataRest="onDataRest" >
      <template slot="form">
        <el-form-item label="任务编码">
          <el-input v-model="listQuery.jobId" placeholder="任务编码" size="small" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input v-model="listQuery.jobName" placeholder="任务名称" size="small" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
      </template>
      <!--extendOperation-->
      <template slot="extendOperation">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="small" icon="el-icon-edit" @click="modify()">新增</el-button>
      </template>
      <!--body-->
      <template slot="body">
        <el-table-column align="center" prop="jobId" label="任务编码" ></el-table-column>
        <el-table-column align="center" prop="jobName" label="任务名称" ></el-table-column>
        <el-table-column align="center" prop="startJob" label="启动状态" >
          <template slot-scope="scope">
            <el-tag :type="scope.row.startJob | statusTagFilter">{{ scope.row.startJob | statusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="startTime"  label="启动时间">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="fireTime" label="触发时间" >
          <template slot-scope="scope">
            <span>{{ scope.row.fireTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="lastFireTime" label="上次执行时间" >
          <template slot-scope="scope">
            <span>{{ scope.row.lastFireTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="nextFireTime"  label="下次执行时间">
          <template slot-scope="scope">
            <span>{{ scope.row.nextFireTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.modifiedTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="modify(scope.row)" >编辑</el-button>
            <el-button type="danger" size="mini" @click="dropRow(scope.row)" >删除</el-button>
          </template>
        </el-table-column>
      </template>
    </data-grid>

    <el-dialog title="任务信息" :visible.sync="modifyVisible">
      <el-form :model="scheduleForm" :rules="rules" ref="scheduleForm" label-width="100px"  label-position="right" style="width: 400px; margin-left:50px;">
        <el-form-item label="任务编号" prop="jobId" size="medium">
          <el-select v-model="scheduleForm.jobId" placeholder="请选择..." @change="onScheduleChanged" style="width:300px;">
            <el-option
              v-for="item in jobIdOptions"
              :key="item.jobId"
              :label="item.jobName"
              :value="item.jobId" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称" prop="jobName" >
          <el-input v-model="scheduleForm.jobName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="Cron表达式" prop="cron" >
          <el-input v-model="scheduleForm.cron" type="cron" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="是否启动" prop="startJob" >
          <el-switch
            v-model="scheduleForm.startJob"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="启动时间" prop="startTime" >
          <el-date-picker
            v-model="scheduleForm.startTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务描述" prop="jobDesc">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="scheduleForm.jobDesc">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getList,findById,save,drop,getJobCombo} from "@/api/sysmgr/schedulejob";

import DataGrid from "@/components/DataGrid";
import { parseTime } from '@/utils'
import waves from "@/directive/waves"; // Waves directive

const statusOptions=[{'key':'正常','value':true}, {'key':'禁用','value':false}]

const statusTypeKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.key
  return acc
}, {})


export default {
  name: "Schedule-Job",
  components: { DataGrid },
  directives: { waves },
  filters: {
    statusFilter(status) {
      return statusTypeKeyValue[status+""]
    },
    statusTagFilter(status){
      const statusMap = {
        "true": 'success',
        "false": 'danger'
      }
      return statusMap[status]
    },
    parseTime
  },
  data() {
    return {
      tableKey:0,
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        limit: 10,
        jobId: null,
        jobName: null
      },

      modifyVisible:false,
      statusOptions:statusOptions,
      jobIdOptions:[],
      scheduleForm:{
        id:null,
        jobId:'',
        jobName:'',
        cron:'',
        jobClass:'',
        startJob:0,
        startTime:'',
        jobDesc: ''
      },
      rules: {
        jobId: [
          { required: true, message: '任务编码是必填项', trigger: 'blur' }
        ],
        jobName: [
          { required: true, message: '任务名称是必填项', trigger: 'blur' }
        ],
        cron: [
          { required: true, message: 'Cron表达式是必填项', trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    modifyVisible(val) {
      if(!val){
        this.scheduleForm.id=null;
        this.scheduleForm.jobId=null;
        this.scheduleForm.jobName= null;
        this.scheduleForm.cron=null;
        this.scheduleForm.jobClass=null;
        this.scheduleForm.startJob=0;
        this.scheduleForm.startTime=null;
        this.scheduleForm.jobDesc= null;
      }
    }
  },
  created() {
    getJobCombo().then(response => {
      this.jobIdOptions = response.data;
    });
  },
  methods: {
    onDataRest(){
      this.listQuery = {}
    },
    handleFilter() {
      this.$refs.dataList.fetchData();
    },
    modify(user){
      this.modifyVisible=true
      if(user){
        let params = {
          id: user.id
        };
        findById(params).then((res) => {
          if(res.result){
            this.scheduleForm=res.data;
          }else{
            this.$message.error(res.code);
          }
        });
      }
    },
    onScheduleChanged(jobId){
      this.jobIdOptions.some(element => {
        if(element.jobId==jobId){
          this.scheduleForm.jobClass=element.jobClass;
          return true;
        }
      });
    },
    submitForm() {// 保存
      this.$refs["scheduleForm"].validate((valid) => {
        if (valid) {
				  let para = this.scheduleForm;
			    save(para).then((res) => {
				    this.modifyVisible = false
            this.$refs.dataList.fetchData();
			  	});
        } else {
          return false;
        }
      });
    },
    dropRow(row){
      this.$confirm('您确定要删除该数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
          let params={};
          if(row.id){
            params.id= row.id;
            drop(params).then((res) => {
              this.$refs.dataList.fetchData();
            });
          }
				}).catch(() => {
      });
    }
  }
};
</script>
