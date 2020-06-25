<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;" size="medium">
    <el-table-column prop="tripDate" label="日期" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.tripDate | parseTime('{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="姓名" align="left" show-overflow-tooltip>
      <template slot-scope="scope">
        {{ scope.row.name }}
      </template>
    </el-table-column>
    <el-table-column prop="perNumber" label="人数" align="center">
      <template slot-scope="scope">
        {{ scope.row.perNumber }}
      </template>
    </el-table-column>
    <el-table-column prop="msgStatus" label="状态" align="center">
      <template slot-scope="scope">
        <el-tag type="info" v-if="scope.row.msgStatus!=null">
          {{ scope.row.msgStatus | parseEnum(messageStatusOptions)  }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getTripList } from '@/api/dashboard'
import { parseTime, parseEnum } from '@/utils'
import { messageStatusEnums } from '@/utils/enum'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    },
    parseTime,
    parseEnum
  },
  data() {
    return {
      list: null,
      messageStatusOptions:messageStatusEnums
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getTripList().then(response => {
        this.list = response.data.slice(0, 9)
      })
    }
  }
}
</script>
