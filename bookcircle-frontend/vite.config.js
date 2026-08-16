import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  define: {
    // Polyfill global for SockJS compatibility in browser environment
    global: 'window',
  },
  
  server: {
    port: 5173,
    host: '0.0.0.0'
  }
})




