//项目发布阶段需要用到的 babel 插件
const prodPlugins = []
if(process.env.NODE_ENV == 'production'){
  //如果处于 build 模式
  prodPlugins.push('transform-remove-console')      //移除控制台输出代码
}

module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import'     //路由懒加载
  ]
}