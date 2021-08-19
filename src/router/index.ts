import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Login from "../components/Login.vue";
import Home from "../components/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
];

const router = new VueRouter({
  routes,
});

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 表示将要访问的路径，from 表示从哪个路径跳转而来，next 是一个函数表示放行或跳转
  if (to.path == "/login") return next(); //如果访问的是 login 则放行
  const tokenStr = window.sessionStorage.getItem("token"); //获取 token
  if (!tokenStr) return next("/login"); //如果没有 token，跳转 login
  next(); //放行
});

export default router;
