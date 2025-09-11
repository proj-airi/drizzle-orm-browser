import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    './src/**/*.ts',
  ],
  unused: true,
  fixedExtension: true,
  copy: [
    { from: './src/types/index.d.ts', to: 'dist/types/index.d.mts' },
  ],
})
