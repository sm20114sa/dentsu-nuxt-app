// import { fileURLToPath } from 'node:url'

// const variablesPath = fileURLToPath(
//   new URL('./app/assets/scss/_variable.scss', import.meta.url)
// )
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          // additionalData: `@use "${variablesPath}" as *;\n`,
        }
      }
    }
  }
})