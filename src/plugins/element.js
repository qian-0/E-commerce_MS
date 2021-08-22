import Vue from 'vue'
//按需导入 element 组件
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, 
    Menu, Submenu, MenuItem  } from 'element-ui'


//注册为全局可用组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.prototype.$message = Message      //Message 需要全局挂载到 Vue