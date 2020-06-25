<template>
  <div class="app-container">

    <data-grid url="/sysmgr/org/list" dataName="listQuery" ref="dataList" @dataRest="onDataRest" >
      <template slot="form">
        <el-form-item label="组织编号">
          <el-input v-model="listQuery.orgId" placeholder="组织编号" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="组织名称">
          <el-input v-model="listQuery.orgName" placeholder="组织名称" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
      </template>
      <!--extendOperation-->
      <template slot="extendOperation">
        <el-form-item>
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-edit" @click="modify()" v-show="hasAuthority('sysmgr.org.save')">新增</el-button>
        </el-form-item>
      </template>
      <!--body-->
      <template slot="body">
        <el-table-column type="index" width="50" align="center" :index="indexMethod" fixed="left"></el-table-column>
        <el-table-column align="left" prop="orgId" label="组织编号" width="120px"></el-table-column>
        <el-table-column align="left" prop="orgName" label="组织名称" width="150px"></el-table-column>
        <el-table-column label="状态" align="center" width="80px">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | parseEnum(disabledOptions)">{{ scope.row.status | parseEnum(validOrFailOptions) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="生效日期" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.effDate | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="失效日期" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.expDate | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="remark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" class-name="small-padding">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="modify(scope.row)" title="编辑" v-show="hasAuthority('sysmgr.org.save')"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="dropRow(scope.row)" title="删除"></el-button>
          </template>
        </el-table-column>
      </template>
    </data-grid>

    <el-dialog title="组织信息" :visible.sync="modifyVisible">
      <el-form :model="orgForm" :rules="rules" ref="orgForm" label-width="80px" label-position="right" size="small" style="width: 400px; margin-left:20px;">
        <el-form-item label="组织编号" prop="orgId">
          <el-input v-model="orgForm.orgId" class="filter-item" placeholder="请输入账号" ></el-input>
        </el-form-item>
        <el-form-item label="组织名称" prop="orgName" >
          <el-input v-model="orgForm.orgName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="orgForm.status" class="filter-item" placeholder="请选择...">
            <el-option v-for="(val,key) in validOrFailOptions" :key="key" :label="val" :value="key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期" prop="effDate" size="medium">
          <el-date-picker
            v-model="effDate"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark" >
          <el-input v-model="orgForm.remark" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" style="width:400px" placeholder="请输入..."></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false" size="small" >取 消</el-button>
        <el-button type="primary" @click="submitForm" size="small" v-show="hasAuthority('sysmgr.org.save')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList,findById,save,drop} from "@/api/sysmgr/org";

import DataGrid from "@/components/DataGrid";
import { parseTime,parseEnum,datetime2String} from '@/utils'
import waves from "@/directive/waves"; // Waves directive
import { validOrFailEnums,disabledEnums} from '@/utils/enum'

export default {
  name: "sysmgrorg",
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
        orgId: null,
        orgName: null
      },
      validOrFailOptions:validOrFailEnums,
      disabledOptions:disabledEnums,

      modifyVisible:false,
      orgForm:{
        id:null,
        orgId:'',
        orgName:'',
        status:'',
        effDate:'',
        expDate:'',
        remark:null
      },
      rules: {
        orgId: [
          { required: true, message: '组织编号是必填项', trigger: 'blur' },
          { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' }
        ],
        orgName: [
          { required: true, message: '组织名称是必填项', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
        ]
      },
      effDate:[],
      pickerOptions: {
        shortcuts: [{
          text: '未来一个月',
          onClick(picker) {
            const start = new Date();
            const end = new Date();
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '未来三个月',
          onClick(picker) {
            const start = new Date();
            const end = new Date();
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '未来的一年',
          onClick(picker) {
            const start = new Date();
            const end = new Date();
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 365);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    };
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
        let params = {
          id: org.id
        };
        findById(params).then((res) => {
          if(res.result){
            this.orgForm.id= res.data.id;
            this.orgForm.orgId= res.data.orgId;
            this.orgForm.orgName=res.data.orgName;
            this.orgForm.status=res.data.status;
            this.orgForm.effDate= res.data.effDate;
            this.orgForm.expDate= res.data.expDate;
            this.orgForm.remark= res.data.remark;
            this.effDate=[new Date(Date.parse(res.data.effDate.replace(/-/g,  "/"))),new Date(Date.parse(res.data.expDate.replace(/-/g,  "/")))];
          }else{
            this.$message.error(res.code);
          }
        });
      }else{
        this.orgForm.id=null
        this.orgForm.orgId=null
        this.orgForm.orgName=null
        this.orgForm.status=null
        this.orgForm.effDate= null
        this.orgForm.expDate= null
        this.orgForm.remark= null
        this.effDate = [];
      }
    },
    submitForm() {// 保存
      this.$refs["orgForm"].validate((valid) => {
        if (valid) {
          this.orgForm.effDate= parseTime(this.effDate[0],"{y}-{m}-{d} 00:00:00");
          this.orgForm.expDate= parseTime(this.effDate[1],"{y}-{m}-{d} 23:59:59");
				  let para = this.orgForm;
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
