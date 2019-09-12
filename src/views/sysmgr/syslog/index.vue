<template>
  <div class="app-container">

    <data-grid url="/sysmgr/syslog/list" dataName="listQuery" ref="dataList" @dataRest="onDataRest" @onDataValid="dataValid" :filterStatus="filterValidStatus">
      <template slot="form">
        <el-form-item label="账号">
          <el-input v-model="listQuery.account" placeholder="账号" size="small" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="请求时间">
          <el-date-picker
            v-model="visitTimeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-ddHH:mm:ss">
          </el-date-picker>
        </el-form-item>
      </template>
      <!--extendOperation-->
      <template slot="extendOperation">
      </template>
      <!--body-->
      <template slot="body">
        <el-table-column align="left" prop="url" label="URL" ></el-table-column>
        <el-table-column align="left" prop="uri" label="URI" ></el-table-column>
        <el-table-column align="center" prop="requestMethod" label="请求方式" ></el-table-column>
        <el-table-column align="right" prop="spendTime" label="请求耗时" ></el-table-column>
        <el-table-column align="left" prop="clazz" label="类名" ></el-table-column>
        <el-table-column align="left" prop="methodName" label="方法名" ></el-table-column>
        <el-table-column align="left" prop="params" label="请求参数" :show-overflow-tooltip="true" ></el-table-column>
        <el-table-column align="center" prop="account" label="用户" ></el-table-column>
        <el-table-column align="center" prop="visitTime" label="用户" >
          <template slot-scope="scope">
            <span>{{ scope.row.visitTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="detail(scope.row)" >查看</el-button>
          </template>
        </el-table-column>
      </template>
    </data-grid>

    <el-dialog title="明细" :visible.sync="modifyVisible">
      <el-form :model="detailData" ref="detailForm" label-width="70px" label-position="right" style="width: 400px; margin-left:50px;">
        <el-form-item label="类/方法" prop="clazz" size="medium">
          {{detailData.clazz}}.{{detailData.methodName}}
        </el-form-item>
        <el-form-item label="请求方式" prop="methodName" >
          {{detailData.methodName}}
        </el-form-item>
        <el-form-item label="参数" prop="email" >
          {{detailData.params}}
        </el-form-item>
        <el-form-item label="用户" prop="account" >
          {{detailData.account}}
        </el-form-item>
        <el-form-item label="请求时间" prop="visitTime" >
          {{detailData.visitTime | parseTime('{y}-{m}-{d} {h}:{i}')}}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList,findById} from "@/api/sysmgr/syslog";


import DataGrid from "@/components/DataGrid";
import { parseTime } from '@/utils'
import waves from "@/directive/waves"; // Waves directive

export default {
  name: "User",
  components: { DataGrid },
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
        id: null,
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
  methods: {
    onDataRest(){
      this.listQuery = {}
      this.visitTimeRange = [];
    },
    handleFilter() {
      this.$refs.dataList.fetchData();
    },
    dataValid() {
      console.log(this.visitTimeRange);
      if(this.visitTimeRange){
        this.listQuery.startDate= this.visitTimeRange[0];
        this.listQuery.endDate= this.visitTimeRange[1];
      }
    },
    detail(sysLog){
      this.modifyVisible=true
      if(sysLog){
        let params = {
          id: sysLog.id
        };
        findById(params).then((res) => {
          if(res.result){
            this.detailData=res.data;
          }else{
            this.$message.error(res.code);
          }
        });
      }
    }
  }
};
</script>
