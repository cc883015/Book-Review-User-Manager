import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  
  base: ' /assignment2/',
  plugins: [react()],
  server: {
    port: 5004,
    open: '/assignment2/login',
    proxy: {
      // 取消路径重写，让 /api 请求直接映射到后端的 /api
      '/api': {
        target: 'http://localhost:4001',
        changeOrigin: true,
        // 去掉 rewrite 或者保持 path 原样
        // rewrite: (path) => path, 
      },
    },
    // 如果开发时不需要 /assignment2 路由前缀，可去掉 base 或使用以下替代：
    // hmr: { protocol: 'ws', host: 'localhost' }
  },
})