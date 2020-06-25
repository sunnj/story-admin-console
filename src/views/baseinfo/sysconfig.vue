<template>
  <div class="app-container">
    <el-form ref="systemForm" label-width="80px"  label-position="left" size="small" >
      <el-form-item label="网站静态化" >
         <el-button type="primary" @click="rewriteWeb()" size="small">更新网站</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align:center;">
      
    </div>
  </div>
</template>
<script>
import { rewrite } from "@/api/sysmgr/system";
import { Message } from 'element-ui'
export default {
  name: "templatesysconfig",
  data() {
    return {
    };
  },
  methods: {
    rewriteWeb() {
      //静态化
      rewrite({}).then((res) => {
        Message({
          message: '静态化更新完成！',
          type: 'success',
          duration: 5 * 1000
        })
      });
    }
  }
};
</script>
