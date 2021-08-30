import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
// import GoodsList from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'
// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'

const Login = () => import(/* webpackChunkName: 'login_home_welcome' */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: 'login_home_welcome' */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: 'login_home_welcome' */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: 'users_rights_roles' */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: 'users_rights_roles' */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: 'users_rights_roles' */ '../components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName: 'cate_params' */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: 'cate_params' */ '../components/goods/Params.vue')

const GoodsList = () => import(/* webpackChunkName: 'goodlist_add' */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName: 'goodlist_add' */ '../components/goods/Add.vue')

const Order = () => import(/* webpackChunkName: 'order_report' */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: 'goodlist_add' */ '../components/report/Report.vue')
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report}
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 表示将要访问的路径，from 表示从哪个路径跳转而来，next 是一个函数表示放行或跳转
  if (to.path == '/login') return next() //如果访问的是 login 则放行
  const tokenStr = window.sessionStorage.getItem('token') //获取 token
  if (!tokenStr) return next('/login') //如果没有 token，跳转 login
  next() //放行
})

export default router
