import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  appType: 'spa', // serve index.html for all routes (prevents 404 on refresh)
})

