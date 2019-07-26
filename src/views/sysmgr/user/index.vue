<template>
  <div class="app-container">

    <data-grid url="/sysmgr/user/list" dataName="listQuery" ref="dataList" @dataRest="onDataRest" >
      <template slot="form">
        <el-form-item label="账号">
          <el-input v-model="listQuery.account" placeholder="账号" size="small" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="listQuery.name" placeholder="姓名" size="small" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
      </template>
      <!--extendOperation-->
      <template slot="extendOperation">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="small" icon="el-icon-edit" @click="modify()">新增</el-button>
      </template>
      <!--body-->
      <template slot="body">
        <el-table-column align="center" prop="id" label="ID" ></el-table-column>
        <el-table-column align="center" prop="account" label="账号" ></el-table-column>
        <el-table-column align="center" prop="name" label="姓名" ></el-table-column>
        <el-table-column align="center" prop="email"  label="邮箱"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusTagFilter">{{ scope.row.status | statusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="ERP账号" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.erpFlag | erpFlagTagFilter">{{ scope.row.erpFlag | erpFlagFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="modify(scope.row)" >编辑</el-button>
            <el-button size="mini" @click="modifyUserRole(scope.row)" >角色</el-button>
            <el-button type="danger" size="mini" @click="dropRow(scope.row)" >删除</el-button>
          </template>
        </el-table-column>
      </template>
    </data-grid>

    <el-dialog title="用户信息" :visible.sync="modifyVisible">
      <el-form :model="userForm" :rules="rules" ref="userForm" label-width="70px"  label-position="right" style="width: 400px; margin-left:50px;">
        <el-form-item label="账号" prop="account" size="medium">
          <el-input v-model="userForm.account" class="filter-item" placeholder="请输入账号" ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name" >
          <el-input v-model="userForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" >
          <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="userForm.status" class="filter-item" placeholder="请选择...">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.key" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="EPR标识">
          <el-select v-model="userForm.erpFlag" class="filter-item" placeholder="请选择...">
            <el-option v-for="item in erpFlagOptions" :key="item.key" :label="item.key" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="角色" :visible.sync="roleVisible">
      <el-tree ref="tree2"
        :data="dataNodes"
        :props="defaultProps"
        accordion
        show-checkbox
        node-key="id"
        :default-expanded-keys="[0,1]"
        :default-checked-keys="defaultSelected"
        :expand-on-click-node="false" >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUserRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList,findById,save,drop,findUserRole,saveUserRole} from "@/api/sysmgr/user";

import { findAllRoleList} from "@/api/sysmgr/role";
//import Pagination from "@/components/Pagination";
import DataGrid from "@/components/DataGrid";
import { parseTime } from '@/utils'
import waves from "@/directive/waves"; // Waves directive

const statusOptions=[{'key':'正常','value':'1'}, {'key':'禁用','value':'0'}]
const erpFlagOptions=[{'key':'否','value':'0'},{'key':'是','value':'1'}]

const statusTypeKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.key
  return acc
}, {})
const erpFlagTypeKeyValue = erpFlagOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.key
  return acc
}, {})

export default {
  name: "User",
  components: { DataGrid },
  directives: { waves },
  filters: {
    statusFilter(status) {
      return statusTypeKeyValue[status]
    },
    statusTagFilter(status){
      const statusMap = {
        "1": 'success',
        "0": 'danger'
      }
      return statusMap[status]
    },
    erpFlagFilter(flag){
      return erpFlagTypeKeyValue[flag]
    },
    erpFlagTagFilter(flag){
      const statusMap = {
        "1": 'success',
        "0": 'info'
      }
      return statusMap[flag]
    },
    parseTime
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value && this.userForm.erpFlag==='0') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    return {
      tableKey:0,
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        limit: 10,
        id: null,
        account: null
      },

      modifyVisible:false,
      statusOptions:statusOptions,
      erpFlagOptions:erpFlagOptions,
      userForm:{
        account:'',
        name:'',
        password:'',
        email:'',
        status:'',
        erpFlag: '0'
      },
      rules: {
        account: [
          { required: true, message: '账户是必填项', trigger: 'blur' },
          { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      currentUserId:null,
      roleVisible:false,
      dataNodes:null,
      defaultSelected:[],
      roleTreeLoading:false,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    };
  },
  watch: {
    roleVisible(val) {
      if(!val){
        this.defaultSelected = [];
      }
    }
  },
  created() {
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
            this.userForm=res.data;
          }else{
            this.$message.error(res.code);
          }
        });
      }else{
        this.userForm.id=null
        this.userForm.account=null
        this.userForm.name=null
        this.userForm.password=null
        this.userForm.email= null
        this.userForm.status= "1"
        this.userForm.erpFlag= "0"
      }
    },
    submitForm() {// 保存
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          // this.userForm.roleIds=this.$refs.multipleTree.getCheckedKeys();
				  let para = this.userForm;
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
    },
    modifyUserRole(row){
      this.roleVisible = true;
      this.roleTreeLoading=true;
      this.currentUserId= row.id;
      //加载全部角色
      findAllRoleList().then(res => {
        var node = {
          id:0,
          name:'所有角色',
          children:res.data
        }
        this.dataNodes = [node];
      });

      //获取已勾选项
      findUserRole({"userId":row.id}).then(res => {
        this.defaultSelected=res.data;
        this.roleTreeLoading = false;
      });
    },
    submitUserRole(){
      var roleIds = this.$refs.tree2.getCheckedKeys();
      let params = {
        "userId":this.currentUserId,
        "roleIds":roleIds
      }
			saveUserRole(params).then((res) => {
        this.roleVisible=false;
        this.currentUserId= null;
        this.defaultSelected=[];
      });
    }
  }
};
</script>
