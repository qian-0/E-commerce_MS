<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form class="login_form" label-width="0px" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!-- label-width: 用于 item 中 label 文本的宽度 -->
        <!-- model: 绑定表单的数据对象 loginForm -->
        <!-- rules: 绑定表单验证规则 loginFormRules -->
        <!-- ref: 定义 表单实例对象 的引用，用以调用表单的方法 -->
        <el-form-item prop="username">
          <!-- prop: 指定具体一条表单验证规则 -->
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表单数据对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //表单验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度为 3-10 字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度应为 6-15 字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
      //restFields(): Form方法，将表单的所有字段重置为初始值
    },
    //登陆前表单预验证
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        //validate(callback: Function(boolean, object)): 表单方法，调用验证规则对整个表单进行验证
        //参数为一个回调函数，并传入两个参数:是否校验成功 'valid' 和未通过校验的字段

        //预校验未通过
        if (!valid) return

        //预验证通过，发起 axios 登录请求
        const { data: res } = await this.$http.post('login', this.loginForm)
        //第一个参数：请求相对路径；第二个参数：请求参数
        //axios 返回 Promise 对象，使用 await 进行解析，而 await 只能用在 async 方法中
        //解析后的数据为 axios 封装的数据，使用 {data:res} 解构赋值 提取有用信息

        //请求失败
        if (res.meta.status !== 200) return this.$message.error('用户名或密码错误')

        //请求成功
        //将该用户的 token 保存到客户端的 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        //跳转到后台主页 '/home'
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
//lang="less" 表示支持 less 语法格式
//scoped：vue 指令，用以控制组件样式生效区间  scoped 表示只在当前组件生效
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
  box-sizing: border-box; //box-sizing: 定义如何计算一个元素的总宽度和高度
}

.btns {
  display: flex;
  justify-content: flex-end; //尾部对齐，justify-content: 设置弹性盒子元素在主轴（横轴）方向上的对齐方式
}
</style>
