import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  define: {
    global: 'window',   // 🔥 THIS FIXES SOCKJS
  },
  
  server: {
    port: 5173,
    host: '0.0.0.0'
  }
})




