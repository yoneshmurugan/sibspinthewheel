import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://sibspinthewheelbackend.vercel.app', // Change to your backend's URL/port
    },
  },
})