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
          :default-expanded-keys="[0,1]"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          @node-click="selectNode" >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
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
            <el-form ref="authorityForm" :rules="rules" :model="formData" v-show="modifyVisible" label-width="100px" style="width: 400px;">
              <el-form-item label="权限编码" prop="code">
              <el-input v-model="formData.code" placeholder="请输入..."></el-input>
              </el-form-item>
              <el-form-item label="权限名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入..."></el-input>
              </el-form-item>
              <el-form-item label="排序" prop="showOrder">
              <el-input v-model.number="formData.showOrder" placeholder="请输入..."></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="authorityDesc">
              <el-input v-model="formData.authorityDesc" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入..."></el-input>
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
import { getList,save,drop } from "@/api/sysmgr/authority";
import { Message, MessageBox } from 'element-ui'
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
        code:null,
        name:null,
        pid:null,
        fullId:null,
        showOrder:null,
        authorityDesc:null,
      },
      modifyVisible:false,      //表单是否显示
      nodeDeleteVisible:false,
      rules: {
        name: [{ required: true, message: '名称是必填项', trigger: 'blur' }]
      },

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

    loadData() {
      this.treeloading = true;
      getList().then(res => {
        var node = {
          id:0,
          label:'所有权限',
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
        'label': '新增权限',
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

        this.modifyVisible=true;
        this.formData.id = data.id;
        this.parentName= data.parentName;
        this.formData.name = data.label;
        this.formData.code = data.code;
        this.formData.pid = data.parentId;
        this.formData.fullId=data.fullId;
        this.formData.showOrder = data.showOrder;
        this.formData.authorityDesc = data.authorityDesc;

      }else{
        this.modifyVisible=false;
      }
    },
    modify(){

    },
    submitForm() {
      this.$refs["authorityForm"].validate((valid) => {
        if (valid) {
          let param = this.formData;
          //新增节点，则清除临时ID
          if(this.isTempNodeId(param.id)){
            param.id= null
          }
			    save(param).then((res) => {
            this.modifyVisible = false
            Message({
              message: '保存成功',
              type: 'success',
              duration: 5 * 1000
            })
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
          console.log(id);
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
