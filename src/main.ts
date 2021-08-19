import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
//导入全局样式表
import "../src/assets/css/global.css";
//导入字体图标
import "../src/assets/fonts/iconfont.css";

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
