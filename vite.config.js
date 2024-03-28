import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import basicSsl from '@vitejs/plugin-basic-ssl'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),basicSsl()],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      formats: ['es'],
      fileName: 'main',
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ['react', 'react-dom','react/jsx-runtime'],
      output: {
          globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'react/jsx-runtime'
          },
      },
  },
  }
})
