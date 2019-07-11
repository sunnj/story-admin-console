<template>
  <div class="dataGrid">
    <div class="search-handler" v-show="searchHandlerVisible">
      <el-form :inline="true" class="demo-form-inline">
        <slot name="form"></slot>
        <el-form-item>
          <el-button type="primary" class="dataGrid-form-submit" size="small" @click="onSubmit" icon="el-icon-search" v-waves>查询</el-button>
          <el-button type="default" class="dataGrid-form-default reset" size="small" @click="onReset" icon="el-icon-refresh" v-waves>重置</el-button>
          <slot name="extendOperation"></slot>
        </el-form-item>
        
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <slot name="body"></slot>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryedData.pageNo" :limit.sync="queryedData.limit" @pagination="fetchData" />
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
      }
    },
    data () {
      return {
        total: 0,
        list: null,
        listLoading:false,
        queryedData:{
          pageNo:1,
          limit:10
        },
        searchHandlerVisible:true,
      }
    },
    created: function() {
//      console.log("created=>",this.isInitLoad);
      var that = this;
      if("false" === that.searchHandlerVisibleSet) {
        that.searchHandlerVisible = false;
      }
      //是否进行初始化加载
      if(that.isInitLoad) {
        this.onSubmit();
      }
    },
    methods: {
      onReset: function() {
        var that = this;
        that.$emit('dataRest', undefined);
        return false;
      },
      onSubmit() {
        this.queryedData.pageNo = 1;
        this.fetchData();
      },
      fetchData(){
        var that = this;
        that.listLoading = true;
//        console.log('parent=>',that.$parent[that.dataName].pageNo,that.$parent[that.dataName].limit)
//        console.log('query=>', this.queryedData.pageNo,this.queryedData.limit)
        setTimeout(() => {
          that.$parent[that.dataName].pageNo = parseInt(this.queryedData.pageNo);
//          that.$parent[that.dataName].limit = that.$parent[that.dataName].limit ? parseInt(that.$parent[that.dataName].limit) : parseInt(this.queryedData.limit);
          that.$parent[that.dataName].limit = parseInt(this.queryedData.limit);
          getRequest(that.url, that.$parent[that.dataName]).then(response => {
            this.total = response.data.total
            this.list = response.data.records
//            console.log("fetchData list length=>",this.list.length);
//            console.log('parent=>',that.$parent[that.dataName].pageNo,that.$parent[that.dataName].limit)
//            console.log('query=>', this.queryedData.pageNo,this.queryedData.limit)
            this.listLoading = false
          })
        }, 100)
        /*console.log('parent=>',that.$parent[that.dataName].pageNo,that.$parent[that.dataName].limit)
        console.log('query=>', this.queryedData.pageNo,this.queryedData.limit)
        that.$parent[that.dataName].pageNo = parseInt(this.queryedData.pageNo);
        that.$parent[that.dataName].limit = parseInt(this.queryedData.limit)/!* ? parseInt(that.$parent[that.dataName].limit) : this.queryedData.limit*!/;
        getList(that.$parent[that.dataName]).then(response => {
          this.total = response.data.total
          this.list = response.data.records
          console.log("fetchData list length=>",this.list.length);
          console.log('parent=>',that.$parent[that.dataName].pageNo,that.$parent[that.dataName].limit)
          console.log('query=>', this.queryedData.pageNo,this.queryedData.limit)
          this.listLoading = false
        })*/
      }

    },
    watch: {

    }
  }
</script>
