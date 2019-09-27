<template>
  <div class="app-container">

    <data-grid url="/baseinfo/dict/list" dataName="listQuery" ref="dataList" @dataRest="onDataRest" >
      <template slot="form">
        <el-form-item label="名称">
          <el-input v-model="listQuery.chnName" placeholder="名称" size="small" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
      </template>
      <!--extendOperation-->
      <template slot="extendOperation">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="small" icon="el-icon-edit" @click="modify()">新增</el-button>
      </template>
      <!--body-->
      <template slot="body">
        <el-table-column align="center" prop="id" label="ID" width="100px"></el-table-column>
        <el-table-column align="center" prop="code" label="编号" ></el-table-column>
        <el-table-column align="center" prop="chnName" label="中文名称" ></el-table-column>
        <el-table-column align="center" prop="showOrder" label="排序" ></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="modify(scope.row)" >编辑</el-button>
            <el-button type="danger" size="mini" @click="dropRow(scope.row)" >删除</el-button>
          </template>
        </el-table-column>
      </template>
    </data-grid>

    <el-dialog :visible.sync="modifyVisible">
      <el-tabs v-model="tabName" @tab-click="handleClick">
				<el-tab-pane label="详情" name="baseInfo">
          <el-form :model="dictForm" :rules="rules" ref="dictForm" label-width="70px"  label-position="right" style="width: 400px; margin-left:50px;">
            <el-form-item label="编码" prop="code" size="medium">
              <el-input v-model="dictForm.code" class="filter-item" placeholder="请输入账号" ></el-input>
            </el-form-item>
            <el-form-item label="中文名" prop="chnName" >
              <el-input v-model="dictForm.chnName" placeholder="请输入..."></el-input>
            </el-form-item>
            <el-form-item label="英文名" prop="engName" >
              <el-input v-model="dictForm.engName" placeholder="请输入..."></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="showOrder" >
              <el-input v-model="dictForm.showOrder" placeholder="请输入..."></el-input>
            </el-form-item>
          </el-form>
          <div class="dialog-footer" style="overflow:hidden;text-align:right;margin-top:20px;">
            <el-button @click="modifyVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </div>
				</el-tab-pane>
        <el-tab-pane label="枚举" name="dictMnt" :disabled="!isShowDictMnt" >
					<el-form>
						<div style="text-align:right;">
							<el-button type="primary" @click.native="appendEnum" size="small"><i class="fa fa-plus-circle" aria-hidden="true"></i>新增</el-button>
						</div>
						<el-table :data="dictMntList.dictMnts" ref="multipleTable" stripe tooltip-effect="dark"
							v-loading="dictMntList.listLoading" @row-click="enumRowClick"
							style="width: 100%;" size=small>
							<el-table-column type="index"	width="50"></el-table-column>
							<el-table-column prop="code" label="编码" sortable='custom' show-overflow-tooltip>
                <template slot-scope="scope" >
                  <span v-if="scope.row.modifyFlag">
                    <el-input v-model="scope.row.code" type="text" placeholder="请输入..." style="width:100%" ></el-input>
                  </span>
                  <span v-else>
                    {{scope.row.code}}
                  </span>
                </template>
              </el-table-column>
							<el-table-column prop="chnName" label="名称" sortable='custom' show-overflow-tooltip>
                <template slot-scope="scope" >
                  <span v-if="scope.row.modifyFlag">
                    <el-input v-model="scope.row.chnName" type="text" placeholder="请输入..." style="width:100%" ></el-input>
                  </span>
                  <span v-else>
                    {{scope.row.chnName}}
                  </span>
                </template>
              </el-table-column>
							<el-table-column prop="engName" label="英文" sortable='custom' show-overflow-tooltip>
                <template slot-scope="scope" >
                  <span v-if="scope.row.modifyFlag">
                    <el-input v-model="scope.row.engName" type="text" placeholder="请输入..." style="width:100%" ></el-input>
                  </span>
                  <span v-else>
                    {{scope.row.engName}}
                  </span>
                </template>
              </el-table-column>
							<el-table-column prop="showOrder" label="排序" sortable='custom'>
                <template slot-scope="scope" >
                  <span v-if="scope.row.modifyFlag">
                    <el-input v-model="scope.row.showOrder" type="text" placeholder="请输入..." style="width:100%" ></el-input>
                  </span>
                  <span v-else>
                    {{scope.row.showOrder}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作"  align="center" width="100" class-name="small-padding fixed-width">
                <template slot-scope="scope" >
                  <el-button type="danger" size="mini" @click="removeEnum(scope.$index, scope.row)" >移除</el-button>
                </template>
              </el-table-column>
						</el-table>
            <div style="overflow:hidden;">
            <el-pagination
							@size-change="dictMntHandleSizeChange"
							@current-change="dictMntListToCurPage"
							:current-page="dictMntList.pageNo"
							:page-sizes="dictMntList.pageSizes"
							:page-size="dictMntList.pageSize"
							layout="total, sizes, prev, pager, next, jumper"
							:total="dictMntList.total">
						</el-pagination>
            </div>
            <div class="dialog-footer" style="overflow:hidden;text-align:right;margin-top:20px;">
              <el-button @click="searchEnumList">重 置</el-button>
              <el-button type="primary" @click="saveEnumList">保 存</el-button>
            </div>
					</el-form>
				</el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { getList,findById,save,drop,batchSave} from "@/api/baseinfo/dict";

import DataGrid from "@/components/DataGrid";
import { parseTime } from '@/utils'
import { Message, MessageBox } from 'element-ui'
import waves from "@/directive/waves"; // Waves directive

export default {
  name: "Dict",
  components: { DataGrid },
  directives: { waves },
  filters: {
    parseTime
  },
  data() {
    var checkShowOrder = (rule, value, callback) => {// 校验显示顺序
      if (value) {
        var regShowOrder=/^\+?[1-9][0-9]*$/;
        if(!regShowOrder.test(value)){
          callback(new Error('请输入正整数'));
        }else{
          callback();
        }
      }
    };
    return {
      tableKey:0,
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        limit: PAGE_SIZE,
        id: null,
        code: null,
        parentCode:''
      },

      modifyVisible:false,
      dictForm:{
        id:'',
        code:'',
        chnName:'',
        showOrder:'',
      },
      rules: {
        code: [
          { required: true, message: '编码是必填项', trigger: 'blur' }
        ]        
      },

      tabName: '',  //Tab选择标签名称
      isShowDictMnt:false,  //枚举是否disabled
      dictMntList:{
        // 列表查询条件封装对象
        filters: {
          parentCode:''
        },
        dictMnts: [],// 列表绑定对象
        total: 0,// 总条数
        pageNo: 1,// 当前页
        pageSize:PAGE_SIZE,// 分页大小
        sort: 'showOrder',// 排序字段
        order: 'asc',// 排序顺序
        pageSizes: PAGE_SIZES,// 分页大小集合
        listLoading: false,// 列表加载标识,
        removedDictMnts: [] //移除的对象
      },
      selectedEnumRow:{}
    };
  },
  methods: {
    onDataRest(){
      this.listQuery.pageNo= 1
        this.listQuery.limit=PAGE_SIZE
        this.listQuery.id=null
        this.listQuery.code=null
        this.listQuery.parentCode=''
    },
    handleFilter() {
      this.$refs.dataList.fetchData();
    },
    modify(dict){
      this.modifyVisible=true;
      this.tabName='baseInfo';
      this.dictMntList.filters.parentCode = "";
      this.dictMntList.dictMnts.splice(0,this.dictMntList.dictMnts.length);

      if(dict){
        let params = {
          id: dict.id
        };
        findById(params).then((res) => {
          if(res.result){
            this.dictForm=res.data;
            this.isShowDictMnt =true;
          }else{
            this.$message.error(res.code);
          }
        });
      }else{
        this.dictForm.id=null
        this.dictForm.code=null
        this.dictForm.chnName=null
        this.dictForm.engName=null
        this.dictForm.parentCode=null
        this.dictForm.showOrder=null
      }
    },
    submitForm() {// 保存
      this.$refs["dictForm"].validate((valid) => {
        if (valid) {
				  let para = this.dictForm;
			    save(para).then((res) => {
				    this.modifyVisible = false
            this.$refs.dataList.fetchData();
				  }).catch((error) => {
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
    handleClick(tab, event) {
      if(this.tabName=='dictMnt'){
        this.dictMntList.filters.parentCode = this.dictForm.code;
        this.searchEnumList();
      }
    },
    //获取枚举列表
    searchEnumList() {
      this.dictMntList.removedDictMnts.splice(0, this.dictMntList.removedDictMnts.length);

      let para = {
        pageNo: this.dictMntList.pageNo,
        pageSize: this.dictMntList.pageSize,
        sort : this.dictMntList.sort,
        order : this.dictMntList.order,
        parentCode: this.dictMntList.filters.parentCode
      };
      this.dictMntList.listLoading = true;
      getList(para).then((res) => {
        this.dictMntList.listLoading = false;
        if(res.code==RESULT_SUCCESS_CODE){
          res.data.records.forEach(element => {
            element.modifyFlag=false;
          });
          this.dictMntList.total = res.data.total;
          this.dictMntList.dictMnts = res.data.records;
        }
      });
    },
    dictMntListToCurPage(val) {// 跳转到指定页
      this.dictMntList.pageNo = val;
      this.searchEnumList();
    },
    dictMntHandleSizeChange(val){// 分页大小改变监控方法
      this.dictMntList.pageSize = val;
      this.searchEnumList();
    },
    enumRowClick(row, event, column){
      if(this.selectedEnumRow && row.id!=this.selectedEnumRow.id){
        this.selectedEnumRow.modifyFlag =false;
        this.selectedEnumRow=null;
      }
      row.modifyFlag=true;
      this.selectedEnumRow=row;
    },
    createEnum(item){
      var index= this.dictMntList.dictMnts.length+1;
      var enumRecord= {
        id: "",
        parentCode:this.dictForm.code,
        chnName:"",
        engName:"",
        showOrder:"",
        modifyFlag:true
      }
      return enumRecord;
    },
    appendEnum(){
      let tempEnumRow= this.createEnum()
      this.dictMntList.dictMnts.push(tempEnumRow);

      this.selectedEnumRow.modifyFlag =false;
      this.selectedEnumRow=tempEnumRow;
    },
    removeEnum(index,row){
      Array.prototype.push.apply(this.dictMntList.removedDictMnts,this.dictMntList.dictMnts.splice(index, 1));
    },
    saveEnumList() {// 保存
      if(this.selectedEnumRow!=null){
        this.selectedEnumRow.modifyFlag =false;
        this.selectedEnumRow=null;
      }
      var params=[];
      var that=this;
      this.dictMntList.dictMnts.forEach(element => {
        var param={
          id: element.id,
          parentCode:element.parentCode,
          code:element.code,
          chnName:element.chnName,
          engName:element.engName,
          showOrder:element.showOrder
        }
        params.push(param);
      });
      this.dictMntList.removedDictMnts.forEach(element => {
        if(element.id){
          var param={
            id: element.id,
            parentCode:element.parentCode,
            code:element.code,
            chnName:element.chnName,
            engName:element.engName,
            showOrder:element.showOrder,
            ynFlag:'0'
          }
          params.push(param);
        }
      });
      batchSave(params).then((res) => {
        that.searchEnumList();
        Message({
          message: '保存成功',
          type: 'success',
          duration: 5 * 1000
        })
      });
    }
  }
};
</script>
