import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: './src/**/*.ts',
  unused: true,
  fixedExtension: true,
})
