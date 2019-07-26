<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;"/>
      </el-header>

      <el-container>
        <el-aside width="300px" v-loading="treeloading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.1)">
          <el-tree ref="tree2"
          :data="dataNodes" class="filter-tree"
          node-key="id"
          default-expand-all
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          @node-click="selectNode" >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span><svg-icon :icon-class="data.iconClass" /> {{ node.label }}</span>
              <span>
                <el-button
                  v-show="data.id==0"
                  type="text"
                  size="mini"
                  @click="($event) => loadData(data,$event)">
                  <i class="el-icon-refresh" />
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="($event) => append(data,$event)">
                  <i class="el-icon-plus" />
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  v-if="data.id!=0"
                  @click="($event) => remove(node, data,$event)">
                  <i class="el-icon-close" />
                </el-button>
              </span>
            </span>
          </el-tree>
        </el-aside>

        <el-main>
          <transition name="el-fade-in">
            <el-form ref="menuForm" :rules="rules" :model="formData" v-show="modifyVisible" label-width="100px" style="width: 400px;">
              <el-form-item label="权限编码" prop="code">
                <el-cascader :options="options" props.expandTrigger="hover" :show-all-levels="false" :props="props_auth" style="width: 100%;"
                  v-model="auth_path" >
                </el-cascader>
              </el-form-item>
              <el-form-item label="菜单名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入..."></el-input>
              </el-form-item>
              <el-form-item label="图标" prop="iconClass">
              <el-input v-model="formData.iconClass" placeholder="请输入..."></el-input>
              </el-form-item>
              <el-form-item label="菜单路径" prop="url">
              <el-input v-model="formData.url" placeholder="请输入..."></el-input>
              </el-form-item>
              <el-form-item label="页面路径" prop="component">
                <el-input v-model="formData.component" placeholder="请输入..."></el-input>
              </el-form-item>
              <el-form-item label="是否隐藏" prop="hiddenFlag">
              <el-switch v-model="formData.hiddenFlag" ></el-switch>
              </el-form-item>
              <el-form-item label="排序" prop="showOrder">
              <el-input v-model.number="formData.showOrder" placeholder="请输入..."></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm" size="small">保存</el-button>
                <el-button type="danger" v-show="nodeDeleteVisible" @click="drop" size="small">删除</el-button>
              </el-form-item>
            </el-form>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getList,save,drop } from "@/api/sysmgr/resource";

import { getList as getAuthList} from "@/api/sysmgr/authority";
export default {
  data() {
    return {
      filterText: "",           //过滤条件
      dataNodes: [],            //tree-data
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      treeloading:false,

      formData:{                //明细表单
        name:null,
        iconClass:null,
        url:null,
        component:null,
        hiddenFlag:null,
        showOrder:null
      },
      modifyVisible:false,      //表单是否显示
      nodeDeleteVisible:false,
      rules: {
        name: [{ required: true, message: '名称是必填项', trigger: 'blur' }]
      },

      options:[],
      props_auth: {             // 权限选择项配置
        value: "id",
        label: "label",
        children: "children"
      },
      auth_path: [],
      auth_find_flag:false,

      currentNodeData:null,     //缓存当前操作的节点
      currentNodeId:null,
      tempNodePrefix:"temp",    //新增节点临时id前缀
      tempNodeIndex:1           //新增节点临时id序号

    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
    currentNodeId(){
      this.nodeDeleteVisible = !this.isTempNodeId(this.currentNodeId);
    }
  },
  methods: {
    isTempNodeId(nodeId){
      //是否临时节点ID
      return (nodeId+"").indexOf(this.tempNodePrefix)>=0
    },
    newTempNodId(){
      //生成临时节点ID
      return this.tempNodePrefix + this.tempNodeIndex++;
    },
    loadAuth(){
      //加载权限列表
      getAuthList().then(res => {
        this.recursiveCheckChildren(res.data);
        this.options = res.data;
      });
    },
    // 递归查询combo列表中的子元素
    recursiveCheckChildren(arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].children && arr[i].children.length > 0) {
          this.recursiveCheckChildren(arr[i].children);
        } else {
          arr[i].children = null;
        }
      }
    },

    loadData() {
      //加载树节点
      this.treeloading = true;
      getList().then(res => {
        var node = {
          id:0,
          label:'所有菜单',
          iconClass:'tree',
          children:res.data
        }
        this.dataNodes = [node];
        this.treeloading = false;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    append(data,event) {
      this.clear();

      const newChild = {
        'id': this.newTempNodId(),
        'label': '新增菜单',
        'pid': data.id,
        'parentName':data.label,
        'children': []
      };

      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(newChild);
      this.modifyVisible=true;

      this.selectNode(newChild);
      event.stopPropagation();
    },
    remove(node, data,event) {
      this.drop(data);
      event.stopPropagation();
    },
    clear(){
      //清理未保存的node
      if(this.currentNodeData && this.isTempNodeId(this.currentNodeData.id)){
        this.$refs.tree2.remove(this.currentNodeData);
      }
    },
    selectNode(data){
      if(data.id){
        if(this.currentNodeData && data.id==this.currentNodeData.id ){
          return;
        }

        this.clear();

        this.currentNodeId=data.id;
        this.currentNodeData=data;

        this.auth_find_flag = false;
        this.auth_path = [];
        this.recursiveFindPath(data.authorityId, this.options);

        this.modifyVisible=true;
        this.formData.id = data.id;
        this.formData.fullId = data.fullId;
        this.parentName= data.parentName;
        this.formData.name = data.label;
        this.formData.iconClass = data.iconClass;
        this.formData.showOrder = data.showOrder;
        this.formData.url = data.url;
        this.formData.component= data.component;
        this.formData.pid = data.pid;
        this.formData.authorityId= data.authorityId;
        this.formData.hiddenFlag = data.hiddenFlag;

      }else{
        this.modifyVisible=false;
      }
    },

    // 递归查找当前选择的菜单的权限节点id路径
    recursiveFindPath(authid, auths) {
      for (var i = 0; i < auths.length; i++) {
        this.auth_path.push(auths[i].id);
        if (this.auth_find_flag) break;
        else {
          if (auths[i].id === authid) {
            this.auth_find_flag = true;
            break;
          } else {
            if (auths[i].children) {
              this.recursiveFindPath(authid, auths[i].children);
            } else {
              this.auth_path.pop();
            }
          }
          if (i === auths.length - 1) {
            this.auth_path.pop();
          }
        }
      }
    },
    submitForm() {
      this.$refs["menuForm"].validate((valid) => {
        if (valid) {
          let param = this.formData;
          //新增节点，则清除临时ID
          if(this.isTempNodeId(param.id)){
            param.id= null
          }
          param.authorityId = this.auth_path[this.auth_path.length - 1];
			    save(param).then((res) => {
				    this.modifyVisible = false
            this.loadData()
			  	});
        } else {
          return false;
        }
      });
    },
    drop(node){
      this.$confirm('您确定要删除该数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
          let id= node.id || this.currentNodeData.id
          let params={};
          if(id){
            params.id= id;
            drop(params).then((res) => {
              //tree中移除
              if(node.id){
                this.$refs.tree2.remove(node);
              }else{
                this.$refs.tree2.remove(this.currentNodeData);
              }

              if(this.currentNodeData.id==id){
                this.currentNodeData={};
                this.currentNodeId=null;

                this.modifyVisible=false;
              }
            });
          }
				});
    }
  },
  mounted() {
    this.loadAuth();
    this.loadData();
  }
};
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13.5px;
    padding-right: 8px;

  }

  .custom-tree-node .el-button{
    color:#606266;
    display:none;
  }
  .el-tree-node__content:hover .el-button {
    display:inline-block;
  }
</style>
