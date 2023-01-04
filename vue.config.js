const prot = 80
module.exports = {
  devServer: {
    port: prot,
    proxy: {
      '/api': {
        target: 'http://localhost:10001/',
        changeOrigin: true, //是否跨域
        // rewrite: (path) => path.replace(/^\/api/, '') // 不可以省略rewrite
        pathRewrite:{'^/api':''},
      }
    }
  }
}


// TODO:跨域的设置
