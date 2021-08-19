import Vue from 'vue'
//按需导入 element 组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'


//注册为全局可用组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message      //Message 需要全局挂载到 Vue