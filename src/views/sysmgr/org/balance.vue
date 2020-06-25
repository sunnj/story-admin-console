<template>
  <div class="app-container">

    <data-grid url="/sysmgr/orgbalance/list" dataName="listQuery" ref="dataList" @dataRest="onDataRest" >
      <template slot="form">
        <el-form-item label="组织">
          <el-select v-model="listQuery.orgId" class="filter-item" filterable reserve-keyword placeholder="请选择..."  @keyup.enter.native="handleFilter" >
            <el-option v-for="item in orgSearchOptions" :key="item.orgId" :label="item.orgName" :value="item.orgId"/>
          </el-select>
        </el-form-item>
      </template>
      <!--extendOperation-->
      <template slot="extendOperation">
        <el-form-item>
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-edit" @click="modify()" v-show="hasAuthority('sysmgr.orgbalance.save')">充值</el-button>
        </el-form-item>
      </template>
      <!--body-->
      <template slot="body">
        <el-table-column type="index" width="50" align="center" :index="indexMethod" fixed="left"></el-table-column>
        <el-table-column align="left" prop="orgId" label="组织编号" width="120px"></el-table-column>
        <el-table-column align="left" prop="orgName" label="组织名称" width="150px"></el-table-column>
        <el-table-column align="right" prop="smsBalance" label="短信余额(元)" width="150px"></el-table-column>
        <el-table-column align="right" prop="totalAmount" label="历史总金额(元)" width="150px"></el-table-column>
        <el-table-column align="left" prop="remark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column label="修改时间" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.modifiedTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" class-name="small-padding">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="modify(scope.row)" title="充值" ></el-button>
          </template>
        </el-table-column>
      </template>
    </data-grid>

    <el-dialog title="短信充值" :visible.sync="modifyVisible">
      <el-form :model="orgbalanceForm" :rules="rules" ref="orgbalanceForm" label-width="80px" label-position="right" size="small" style="width: 400px; margin-left:20px;">
        <el-form-item label="组织" prop="orgId" v-show="hasAuthority('sysmgr.org.query')">
          <el-select v-model="orgbalanceForm.orgId" class="filter-item" filterable reserve-keyword placeholder="请选择...">
            <el-option v-for="item in orgSearchOptions" :key="item.orgId" :label="item.orgName" :value="item.orgId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="smsBalance" >
          <el-input v-model="orgbalanceForm.smsBalance" type="text" placeholder="请输入..."></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" >
          <el-input v-model="orgbalanceForm.remark" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" style="width:400px" placeholder="请输入..."></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false" size="small" >取 消</el-button>
        <el-button type="primary" @click="submitForm" size="small" v-show="hasAuthority('sysmgr.orgbalance.save')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList,findById,save,drop} from "@/api/sysmgr/orgbalance";
import { queryOrgCombo} from "@/api/sysmgr/org";
import DataGrid from "@/components/DataGrid";
import { parseTime,parseEnum,datetime2String} from '@/utils'
import waves from "@/directive/waves"; // Waves directive
import { validOrFailEnums,disabledEnums} from '@/utils/enum'

export default {
  name: "sysmgrbalance",
  components: { DataGrid },
  directives: { waves },
  filters: {
    parseTime,
    parseEnum
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
        orgId: null
      },
      validOrFailOptions:validOrFailEnums,
      disabledOptions:disabledEnums,

      modifyVisible:false,
      orgbalanceForm:{
        orgId:'',
        smsBalance:'',
        remark:null
      },
      rules: {
        orgId: [
          { required: true, message: '组织是必选项', trigger: 'blur' },
        ],
        smsBalance: [
          { required: true, message: '金额必填项', trigger: 'blur' },
        ]
      },
      orgSearchOptions:[],
    };
  },
  watch: {
    modifyVisible(val) {
      if(!val){
        this.orgbalanceForm.orgId=null;
        this.orgbalanceForm.smsBalance=null;
        this.orgbalanceForm.remark= null;
      }
    }
  },
  created() {
    if(this.hasAuthority('sysmgr.org.query')){
      queryOrgCombo({}).then((res) => {
        this.orgSearchOptions = res.data;
      });
    }
  },
  methods: {
    indexMethod(index) {
      return index + ((this.listQuery.pageNo-1) * this.listQuery.limit) + 1;
    },
    onDataRest(){
      this.listQuery = {}
    },
    handleFilter() {
      this.$refs.dataList.fetchData();
    },
    modify(org){
      this.modifyVisible=true
      if(org){
        this.orgbalanceForm.orgId= org.orgId;
      }
    },
    submitForm() {// 保存
      this.$refs["orgbalanceForm"].validate((valid) => {
        if (valid) {
				  let para = this.orgbalanceForm;
			    save(para).then((res) => {
				    this.modifyVisible = false
            this.$refs.dataList.fetchData();
			  	});
        } else {
          return false;
        }
      });
    }
  }
};
</script>
