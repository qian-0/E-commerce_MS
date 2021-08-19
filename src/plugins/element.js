import Vue from 'vue'
//按需导入 element 组件
import { Button } from 'element-ui'
import { Form,FormItem } from 'element-ui'
import { Input } from 'element-ui'

//注册为全局可用组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)