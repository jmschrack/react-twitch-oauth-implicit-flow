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
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
          globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
          },
      },
  },
  }
})
