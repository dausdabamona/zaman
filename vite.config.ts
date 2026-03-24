import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/zaman/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'ZAMAN — Eisenhower Matrix',
        short_name: 'ZAMAN',
        description: 'Aplikasi manajemen waktu personal berbasis Eisenhower Matrix dengan jadwal shalat',
        theme_color: '#1E293B',
        background_color: '#0F172A',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/zaman/',
        start_url: '/zaman/',
        icons: [
          {
            src: '/zaman/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/zaman/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/zaman/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.aladhan\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'aladhan-api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24, // 24 jam
              },
            },
          },
        ],
      },
    }),
  ],
})
