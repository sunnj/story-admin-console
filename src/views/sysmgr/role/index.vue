<template>
  <div class="app-container">

    <data-grid url="/sysmgr/role/list" dataName="listQuery" ref="dataList" @dataRest="onDataRest" >
      <template slot="form">
        <el-form-item label="名称">
          <el-input v-model="listQuery.name" placeholder="名称" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
      </template>
      <!--extendOperation-->
      <template slot="extendOperation">
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="modify()" v-show="hasAuthority('sysmgr.role.save')">新增</el-button>
        </el-form-item>
      </template>
      <!--body-->
      <template slot="body">
        <el-table-column type="index" width="50" align="center" :index="indexMethod" fixed="left"></el-table-column>
        <el-table-column align="left" prop="name" label="名称" ></el-table-column>
        <el-table-column align="left" prop="roleDesc" label="描述" ></el-table-column>
        <el-table-column align="center" prop="modifiedTime" label="编辑时间">
          <template slot-scope="scope">{{ scope.row.modifiedTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</template>
        </el-table-column>
        <el-table-column align="center" prop="createdTime" label="创建时间">
          <template slot-scope="scope">{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="modify(scope.row)" title="编辑" v-show="hasAuthority('sysmgr.role.save')"></el-button>
            <el-button size="mini" icon="el-icon-user" @click="auth(scope.row)" title="权限" v-show="hasAuthority('sysmgr.role.save')"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="dropRow(scope.row)" title="删除" v-show="hasAuthority('sysmgr.role.delete')"></el-button>
          </template>
        </el-table-column>
      </template>
    </data-grid>
    <el-dialog title="角色信息" :visible.sync="modifyVisible">
      <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="70px" label-position="right" size="small" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="account">
          <el-input v-model="roleForm.name" class="filter-item" placeholder="请输入角色名称" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false" size="small" >取 消</el-button>
        <el-button type="primary" @click="submitForm" size="small" v-show="hasAuthority('sysmgr.role.save')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="权限" :visible.sync="authVisible">
      <el-tree ref="tree2"
        :data="dataNodes"
        accordion
        show-checkbox
        node-key="id"
        :default-expanded-keys="[0,1]"
        :default-checked-keys="defaultSelected"
        :expand-on-click-node="false" >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="authVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitAuth" size="small" v-show="hasAuthority('sysmgr.role.save')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList,findById,save,drop,modifyAuth,findRoleAuth } from "@/api/sysmgr/role";
import { getList as findAuthList} from "@/api/sysmgr/authority";
import { parseTime } from '@/utils'
//import Pagination from "@/components/Pagination";
import DataGrid from "@/components/DataGrid";
import waves from "@/directive/waves"; // Waves directive
export default {
  name: "sysmgrrole",
  components: { DataGrid },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        limit: 10,
        name:null
      },
      modifyVisible:false,
      roleForm:{},
      rules: {
        name: [{ required: true, message: '名称是必填项', trigger: 'blur' }]
      },

      currentAuthRoleId:null,
      authVisible:false,
      dataNodes:[],
      defaultSelected:[],
      authTreeLoading:false
    };
  },
  watch: {
    authVisible(val) {
      if(!val){
        this.defaultSelected=[];
      }
    }
  },
  filters:{
    parseTime
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
    modify(role){
      this.modifyVisible=true
      if(role){
        let params = {
          id: role.id
        };
        findById(params).then((res) => {
          if(res.result){
            this.roleForm=res.data;
          }else{
            this.tipMsgBox(res.code);
          }
        });
      }else{
        roleForm.id=null
        roleForm.name=null
      }
    },
    submitForm() {// 保存
      this.$refs["roleForm"].validate((valid) => {
        if (valid) {
				  let para = this.roleForm;
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
    auth(row){
      this.authVisible = true;
      this.authTreeLoading=true;
      this.currentAuthRoleId= row.id;
      //加载全部权限
      findAuthList().then(res => {
        var node = {
          id:0,
          label:'所有权限',
          children:res.data
        }
        this.dataNodes = [node];
        
      });

      //获取已勾选项
      findRoleAuth({"roleId":row.id}).then(res => {
        this.defaultSelected=res.data;
        this.authTreeLoading = false;
      });
    },
    submitAuth(){
      var authCodes = this.$refs.tree2.getCheckedKeys();//选中节点
      var authCodesHalf = this.$refs.tree2.getHalfCheckedKeys();//半选中节点
      var authCodesAll = authCodesHalf.concat(authCodes);
      console.log("submitAuth authCodes=>",authCodes," authCodesHalf=>",authCodesHalf," authCodesAll=>",authCodesAll);
      let params = {
        "roleId":this.currentAuthRoleId,
        "authorityIds":authCodesAll
      }
      modifyAuth(params).then((res) => {
        this.authVisible=false;
        this.currentAuthRoleId= null;
      });
    }
  }
};
</script>
