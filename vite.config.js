import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative paths, so the built site works on GitHub Pages under /open-when/.
  base: './',
  build: {
    // Two pages: the letters site and the "write a letter" form.
    rollupOptions: {
      input: {
        main: 'index.html',
        write: 'write.html',
      },
    },
  },
})
