<template>
  <div class="app-container">
    <el-form :model="userForm" :rules="rules" ref="userForm" label-width="80px"  label-position="left" style="width: 400px;margin:0px auto;">
      <el-form-item label="原密码" prop="password" >
        <el-input v-model="userForm.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword" >
        <el-input v-model="userForm.newPassword" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword" >
        <el-input v-model="userForm.confirmPassword" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align:center;">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="$router.push({path:'/'})">取 消</el-button>
    </div>
  </div>
</template>
<script>
import { editpassword } from "@/api/sysmgr/user";
import { Message } from 'element-ui'
export default {
  name: "User",
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.userForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      userForm:{
        password:'',
        newPassword:'',
        confirmPassword:''
      },
      rules: {
        password: [{ required: true, message: '原密码是必填项', trigger: 'blur' }],
        newPassword: [{ required: true, message: '新密码是必填项', trigger: 'blur' }],
        confirmPassword: [
          { required: true, message: '确认密码是必填项', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }]
      }
    };
  },
  methods: {
    submitForm() {// 保存
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
				  let para = this.userForm;
			    editpassword(para).then((res) => {

            this.userForm.password="";
            this.userForm.newPassword="";
            this.userForm.confirmPassword="";

            Message({
              message: '修改成功',
              type: 'success',
              duration: 5 * 1000
            })
				  }).catch((error) => {
            this.this.$message.error('系统错误，请稍后重试')
			  	});
        } else {
          return false;
        }
      });
    }
  }
};
</script>
