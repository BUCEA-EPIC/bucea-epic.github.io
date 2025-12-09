// vue3/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // 🟢 新增以下 server 配置
  server: {
    host: '0.0.0.0', // 允许局域网访问（可选）
    port: 5173,      // 前端端口（默认）
    proxy: {
      // 捕获所有以 /api 开头的请求
      '/api': {
        target: 'http://127.0.0.1:8000', // 转发目标：本地后端
        changeOrigin: true,              // 修改 Host 头，防止后端 CORS 问题
        // 关键点：重写路径，去掉 /api 前缀
        // 这与你 Nginx 配置中的 proxy_pass http://127.0.0.1:8000/; 行为一致
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})