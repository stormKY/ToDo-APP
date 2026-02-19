import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ToDo-APP/',
  server: {
    proxy: {
      '/api/holidays.ics': {
        target: 'https://calendar.google.com',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/calendar/ical/ko.south_korea%23holiday%40group.v.calendar.google.com/public/basic.ics',
      },
      '/api/holidays': {
        target: 'https://calendar.google.com',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/calendar/ical/ko.south_korea%23holiday%40group.v.calendar.google.com/public/basic.ics',
      },
    },
  },
})
