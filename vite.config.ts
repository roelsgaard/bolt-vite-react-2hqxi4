import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://*.webcontainer-api.io",
        "script-src-elem 'self' 'unsafe-inline' https://maps.googleapis.com https://*.webcontainer-api.io",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' https: data:",
        "connect-src 'self' http://localhost:* https://maps.googleapis.com https://*.webcontainer-api.io ws://*.webcontainer-api.io",
        "frame-src 'self'",
        "font-src 'self'",
        "worker-src 'self' blob:",
      ].join('; '),
    },
  },
})