import { resolve } from 'node:path'

import DrizzleORMMigrations from '@proj-airi/unplugin-drizzle-orm-migrations/vite'
import Shiki from '@shikijs/markdown-it'
import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import Markdown from 'unplugin-vue-markdown/vite'
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
    Markdown({
      markdownItUses: [
        await Shiki({
          themes: {
            light: 'catppuccin-latte',
            dark: 'catppuccin-mocha',
          },
        }),
      ],
    }),
    // https://github.com/posva/unplugin-vue-router
    VueRouter({
      extensions: ['.vue', '.md'],
      dts: resolve(import.meta.dirname, 'src', 'typed-router.d.ts'),
    }),
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    Unocss(),
    Inspect(),
    DrizzleORMMigrations(),
  ],
})
