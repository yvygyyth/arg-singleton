import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  mode: 'production',
    build: {
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: 'src/index',
        name: 'arg-singleton',
        // the proper extensions will be added
        fileName: 'index',
        formats: ['es', 'umd']
      }
    },
    plugins: [
      dts({
        tsconfigPath: 'tsconfig.app.json',
        // include: 'src/index',
        // exclude: ['**/*.spec.ts', '**/test-utils'],
        copyDtsFiles: true,
        rollupTypes: true
      })
  ]
})
