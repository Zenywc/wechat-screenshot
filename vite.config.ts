import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ mode }) => {
  // Standalone mode: single HTML file, no base path
  if (mode === 'standalone') {
    return {
      plugins: [react(), tailwindcss(), viteSingleFile()],
    }
  }

  // Gitee Pages mode
  return {
    base: '/wechat-screenshot/',
    plugins: [react(), tailwindcss()],
  }
})
