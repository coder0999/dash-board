import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/dash-board/',
  plugins: [react()],
  define: {
    'global': {},
  },
  resolve: {
    alias: {
      'events': 'events',
    },
  },
})
