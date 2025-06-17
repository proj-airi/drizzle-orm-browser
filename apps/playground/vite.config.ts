import { resolve } from 'node:path'

import DrizzleORMMigrations from '@proj-airi/unplugin-drizzle-orm-migrations/vite'
import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  optimizeDeps: {
    exclude: [
      '@electric-sql/pglite',
    ],
  },
  plugins: [
    // https://github.com/posva/unplugin-vue-router
    VueRouter({
      extensions: ['.vue', '.md'],
      dts: resolve(import.meta.dirname, 'src', 'typed-router.d.ts'),
    }),
    Vue(),
    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    Unocss(),
    Inspect(),
    DrizzleORMMigrations(),
  ],
})
