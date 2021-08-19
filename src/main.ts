import Vue from "vue";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
//导入全局样式表
import "../src/assets/css/global.css";
//导入字体图标
import "../src/assets/fonts/iconfont.css";

Vue.config.productionTip = false;
Vue.prototype.$http = axios; //Vue 挂载 axios
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"; //设置 axios 请求根路径

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
