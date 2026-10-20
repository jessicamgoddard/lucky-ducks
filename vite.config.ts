import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://jessicamgoddard.github.io/random-picker/
  base: '/random-picker/',
  plugins: [react()],
})
