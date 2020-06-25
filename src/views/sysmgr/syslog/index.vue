<template>
  <div class="app-container">

    <data-grid url="/sysmgr/syslog/list" dataName="listQuery" ref="dataList" @dataRest="onDataRest" @onDataValid="dataValid" :filterStatus="filterValidStatus">
      <template slot="form">
        <el-form-item label="账号">
          <el-input v-model="listQuery.account" placeholder="账号" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="请求时间">
          <el-date-picker 
            v-model="visitTimeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-ddHH:mm:ss"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
      </template>
      <!--extendOperation-->
      <template slot="extendOperation">
      </template>
      <!--body-->
      <template slot="body">
        <el-table-column align="left" prop="url" label="URL" width="250"></el-table-column>
        <el-table-column align="left" prop="uri" label="URI" ></el-table-column>
        <el-table-column align="center" prop="requestMethod" label="请求方式" width="80"></el-table-column>
        <el-table-column align="right" prop="spendTime" label="请求耗时" width="80"></el-table-column>
        <el-table-column align="left" prop="clazz" label="类名" width="150" show-overflow-tooltip="true"></el-table-column>
        <el-table-column align="left" prop="methodName" label="方法名" width="100"></el-table-column>
        <el-table-column align="left" prop="params" label="请求参数" show-overflow-tooltip="true" ></el-table-column>
        <el-table-column align="center" prop="account" label="用户" width="100"></el-table-column>
        <el-table-column align="center" prop="visitTime" label="访问时间" >
          <template slot-scope="scope" width="150">
            <span>{{ scope.row.visitTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-view" @click="detail(scope.row)" title="查看"></el-button>
          </template>
        </el-table-column>
      </template>
    </data-grid>

    <el-dialog title="日志明细" :visible.sync="modifyVisible">
      <el-form :model="detailData" ref="detailForm" label-width="70px" label-position="right" size="small" style="margin-left:50px;">
        <el-form-item label="类/方法" prop="clazz" size="medium">
          {{detailData.clazz}}.{{detailData.methodName}}
        </el-form-item>
        <el-form-item label="请求方式" prop="methodName" >
          {{detailData.methodName}}
        </el-form-item>
        <json-editor ref="jsonEditor" v-model="detailData.params" />
        <el-form-item label="用户" prop="account" >
          {{detailData.account}}
        </el-form-item>
        <el-form-item label="请求时间" prop="visitTime" >
          {{detailData.visitTime | parseTime('{y}-{m}-{d} {h}:{i}')}}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList,findById} from "@/api/sysmgr/syslog";

import JsonEditor from '@/components/JsonEditor'
import DataGrid from "@/components/DataGrid";
import { parseTime } from '@/utils'
import waves from "@/directive/waves"; // Waves directive

export default {
  name: "sysmgrsyslog",
  components: { DataGrid, JsonEditor},
  directives: { waves },
  filters: {
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
        account: null,
        startDate:'',
        endDate:''
      },
      visitTimeRange:[],
      filterValidStatus:true,

      modifyVisible:false,
      detailData:{
      },
    };
  },
  watch:{
    "visitTimeRange":{
      handler(newValue,oldValue){
        this.listQuery.startDate= newValue[0];
        this.listQuery.endDate= newValue[1];
      }
    }
  },
  methods: {
    onDataRest(){
      this.listQuery = {}
      this.visitTimeRange = [];
    },
    handleFilter() {
      this.$refs.dataList.fetchData();
    },
    // dataValid() {
    //   if(this.visitTimeRange){
    //     this.listQuery.startDate= this.visitTimeRange[0];
    //     this.listQuery.endDate= this.visitTimeRange[1];
    //   }
    // },
    detail(sysLog){
      this.modifyVisible=true
      if(sysLog){
        let params = {
          id: sysLog.id
        };
        findById(params).then((res) => {
          if(res.result){
            this.detailData=res.data;
            if(res.data.params){
              res.data.params=JSON.parse(res.data.params);
            }
          }else{
            this.$message.error(res.code);
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.editor-container{
  position: relative;
  height: 100%;
}
</style>