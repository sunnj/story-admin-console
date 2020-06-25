<template>
  <div class="dataGrid">
    <div class="search-handler" v-show="searchHandlerVisible">
      <el-form :inline="true" class="demo-form-inline" size="small">
        <slot name="form"></slot>
        <el-form-item>
          <el-button type="primary" class="dataGrid-form-submit" size="mini" @click="onSubmit" icon="el-icon-search" v-waves>查询</el-button>
          <el-button type="default" class="dataGrid-form-default reset" size="mini" @click="onReset" icon="el-icon-refresh" v-waves>重置</el-button>
        </el-form-item>
        <slot name="extendOperation"></slot>
      </el-form>
    </div>
    <el-table 
      ref="datagridTable"
      @selection-change="handleSelectionChangeEvent"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      :stripe="true"
      fit
      highlight-current-row
      :max-height="maxHeight"
      :show-summary="showSummary"
      :summary-method="summaryMethod"
      :default-sort = defaultSort
      @sort-change="onSortChange"
      @row-click="handleRowClickEvent">
      <slot name="body"></slot>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryedData.pageNo" :limit.sync="queryedData.limit" @pagination="fetchData" :pageSizes="pageSizes" />
  </div>
</template>

<script>
  import { getRequest } from '@/api/axiosCommom'
  import Pagination from '@/components/Pagination'
  import waves from '@/directive/waves'
  export default {
    name: 'DataGrid',
    components: { Pagination },
    directives: { waves },
    props: {
      url: {},
      dataName: {},
      searchHandlerVisibleSet: {},
      isInitLoad: {
        default: true
      },
      filterStatus:{  //查询条件验证通过状态
        default:true,
        type:Boolean
      },
      limit: {  //页大小
        type: Number,
        default:PAGE_SIZE
      },
      pageSizes: {  //分页选项
        type: Array
      },
      defaultSort:{ //默认排序
        type:Object
      },
      maxHeight:{ //Table最大高度
        default:null
      },
      showSummary:{ //显示合计行
        default:false,
        type:Boolean
      },
      summaryMethod:{ //自定义合计
        default:null
      }
    },
    data () {
      return {
        total: 0,
        list: null,
        listLoading:false,
        queryedData:{
          pageNo:1,
          limit:null
        },
        searchHandlerVisible:true,
      }
    },
    created: function() {
      if("false" === this.searchHandlerVisibleSet) {
        this.searchHandlerVisible = false;
      }
      //是否进行初始化加载
      if(this.isInitLoad) {
        this.onSubmit();
      }
    },
    methods: {
      onReset: function() {
        this.$emit('dataRest', undefined);
        return false;
      },
      onSortChange: function(column, prop, order) {
        this.$emit("sortChange", column, prop, order);
        return false;
      },
      onSubmit() {
        let that=this;
        this.queryedData.pageNo = 1;
        this.$emit('onDataValid',undefined);
        setTimeout(function(){
          if(that.filterStatus){
            that.$parent[that.dataName].pageNo = 1;
            that.fetchData();
          }
        },100);
      },
      fetchData(){
        var that = this;
        that.queryedData.limit=this.limit;
        that.listLoading = true;
        setTimeout(() => {
          that.$parent[that.dataName].pageNo = parseInt(this.queryedData.pageNo);
          that.$parent[that.dataName].limit = parseInt(this.queryedData.limit);
          getRequest(that.url, that.$parent[that.dataName]).then(response => {
            this.total = response.data.total
            this.list = response.data.records
            this.$emit('onDataLoadSuccess',response);
            this.listLoading = false
          })
        }, 100)
      },
      toggleRowSelection:function(row,column){
        this.$refs.datagridTable.toggleRowSelection(row);
      },
      handleSelectionChangeEvent: function(val) {
        this.$emit("handleSelectionChange", val);
        return false;
      },
      handleRowClickEvent: function(row, column, event) {
        this.$emit("handleRowClick", row, column, event);
        return false;
      }
    }
  }
</script>
