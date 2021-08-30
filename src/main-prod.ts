import Vue from 'vue'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import App from './App.vue'
import router from './router'
import NProgress from 'nprogress'
//导入全局样式表
import '../src/assets/css/global.css'
//导入字体图标
import '../src/assets/fonts/iconfont.css'

Vue.config.productionTip = false

//设置 axios 请求根路径
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
//设置 axios 请求拦截器 —— axios.interceptors.request
axios.interceptors.request.use(config => {
  //展示进度条
  NProgress.start()
  //为请求头添加 token 验证的 authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //必须 return config
  return config
})
//设置 axios 响应拦截器
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

//将 axios 挂载到 Vue
Vue.prototype.$http = axios

//全局注册
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

//定义全局过滤器
Vue.filter('dateFormat', (originVal: string | number | Date) => {
  const dt = new Date(originVal)
  const year = dt.getFullYear()
  const month = (dt.getMonth() + 1 + '').padStart(2, '0')
  const date = (dt.getDate() + '').padStart(2, '0')
  const hour = (dt.getHours() + '').padStart(2, '0')
  const minute = (dt.getMinutes() + '').padStart(2, '0')
  const second = (dt.getSeconds() + '').padStart(2, '0')
  return `${ year }-${ month }-${ date } ${ hour }:${ minute }:${ second }`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
