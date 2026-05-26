import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://opscore-api-5s87.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})