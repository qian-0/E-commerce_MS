<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        class="login_form"
        label-width="0px"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!--label-width 用于 item 中 label 属性的宽度 -->
        <!-- :model 将表单的数据自动绑定到 loginForm 对象上 -->
        <!-- :rules 绑定表单验证规则，loginFormRules 是一个表单验证规则对象 -->
        <el-form-item prop="username">
          <!-- prop 属性用于指定 username 这一条表单验证规则 -->
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
          <!-- v-model 将输入数据与 loginForm 对象的属性双向绑定 -->
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户名长度为 3-10 字符", trigger: "blur" }
        ],
        password: []
      }
    };
  }
};
</script>

<!-- lang="less" 表示支持 less 语法格式 -->
<!-- scoped：vue 指令，用以控制组件样式生效区间  scoped 表示只在当前组件生效 -->
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 3px;
  //使box处于正中心
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #ddd;
  border-radius: 50%; //圆角，使box变圆形
  padding: 5px; //内边距，使图片与边框有距离
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box; //box-sizing 定义如何计算一个元素的总宽度和高度
}
.btns {
  display: flex;
  justify-content: flex-end; //尾部对齐，justify-content 设置弹性盒子元素在主轴（横轴）方向上的对齐方式
}
</style>
