const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/post': {
        target: 'https://blackjack.fuzz.me.uk/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '/post': ''
        }
      }
    }
  }
})
