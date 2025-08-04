import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'index': './src/index.ts',
    'pglite/index': './src/pglite/index.ts',
    'pg/index': './src/pg/index.ts',
  },
  unused: true,
  fixedExtension: true,
})
