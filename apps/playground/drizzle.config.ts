import { defineConfig } from 'drizzle-kit'

import 'dotenv/config'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
})
