<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- width 绑定 isCollapse 使得侧边栏根据菜单是否折叠变化宽度 -->
        <div class="toggle-button" @click="toggleCollapse">::</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
        >
        <!-- active-text-color 为选中的菜单项的颜色 -->
        <!-- unique-opened: Menu组件属性，是否只保持一个子菜单展开 -->
        <!-- collapse: Menu组件属性，是否水平折叠收起菜单 -->
        <!-- collapse-transition: Menu组件，是否开启折叠动画 -->
        <!-- router: Menu组件，是否使用 vue-router 模式（以 index 作为 path 进行路由跳转）-->
          <!-- el-submenu 一级菜单 -->
          <el-submenu :index=item.id.toString() v-for="item in menulist" :key="item.id">
          <!-- index 只接收字符串，且当点击菜单时，展开或折叠所以相同 index 的菜单项 -->
            <!-- template 是一级菜单的模板 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- el-menu-item 是二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // name:'Home',
  data() {
    return {
      //左侧菜单数据
      menulist: [],
      //一级菜单 id 与 图标名 的键值对
      iconsObj:{
        '125':"iconfont icon-user",
        '103':"iconfont icon-tijikongjian",
        '101':"iconfont icon-shangpin",
        '102':"iconfont icon-danju",
        '145':'iconfont icon-baobiao'
      },
      //表示菜单是否水平折叠
      isCollapse:false
    }
  },
  //生命周期函数
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    //切换菜单的折叠与展开
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
//elenment 中 组件名即是类名
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  //处理 span 文字
  color: #fff;
  font-size: 25px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    //消除边框线
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 16px;
  line-height: 24px;
  color:#fff;
  text-align: center;
  //字符间距
  letter-spacing:0.2em;
  //鼠标在按钮上变成手指
  cursor: pointer;
}
</style>
