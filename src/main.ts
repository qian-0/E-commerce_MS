import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
//导入 element ui
import './plugins/element.js'
//导入全局样式表
import '../src/assets/css/global.css'
//导入字体图标
import '../src/assets/fonts/iconfont.css'

Vue.config.productionTip = false
//设置 axios 请求根路径
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
//设置 axios 请求拦截器 —— axios.interceptors.request
axios.interceptors.request.use(config => {
  //为请求头添加 token 验证的 authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //必须 return config
  return config
})
//将 axios 挂载到 Vue
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
