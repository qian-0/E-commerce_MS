//修改 webpack 默认配置
module.exports = {
  //通过新增 configureWebpack 或 chainWebpack 节点来自定义 webpack 打包配置
  //两者作用完全相同，但前者通过操纵对象方式，后者通过链式编程方式
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      //先获取默认打包入口，并将其清空；再将新的打包入口添加
      config.entry('app').clear().add('./src/main-prod.ts')

      //通过 externals 节点，配置并加载外部的 CDN 资源
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })

    })
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.ts')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}