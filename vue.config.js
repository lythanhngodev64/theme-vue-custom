// vue.config.js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuex', // Ví dụ: nếu bạn có vuex
    // Thêm các dependency khác vào đây nếu cần transpile
  ]
})