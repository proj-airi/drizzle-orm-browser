## Getting Started

```shell
# from @antfu/ni, can be installed via `npm i -g @antfu/ni`
ni -D @proj-airi/unplugin-drizzle-orm-migrations @proj-airi/drizzle-orm-browser-migrator
pnpm i -D @proj-airi/unplugin-drizzle-orm-migrations @proj-airi/drizzle-orm-browser-migrator
yarn i -D @proj-airi/unplugin-drizzle-orm-migrations @proj-airi/drizzle-orm-browser-migrator
npm i -D @proj-airi/unplugin-drizzle-orm-migrations @proj-airi/drizzle-orm-browser-migrator
```

Configure your `vite.config.ts` (or rolldown, rspack, Webpack, esbuild, all supported) to use the plugin:

```ts
import { unpluginDrizzleOrmMigrations } from '@proj-airi/unplugin-drizzle-orm-migrations/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // ... other plugins
    unpluginDrizzleOrmMigrations()
  ]
})
```

In your actual initialization code (e.g. `src/main.ts`, `src/App.vue`, `src/App.tsx` or `src/index.ts`):

```ts
import { IdbFs, PGlite } from '@electric-sql/pglite'
// Import the migrator
import { migrate } from '@proj-airi/drizzle-orm-browser-migrator/pglite'
import { drizzle } from 'drizzle-orm/pglite'
// Import the bundled migrations
import migrations from 'virtual:drizzle-migrations.sql'

const pgLite = new PGlite({ fs: new IdbFs('pglite-database') })
const db = drizzle({ client: pgLite })

// Apply the migrations
await migrate(db, migrations)
```

## Why?

Building a local-first app, or embedded memory system for LLMs in browser? It's
hard to run migrations in browser with `drizzle-kit` currently, where `drizzle-kit`
is essentially a CLI tool runs migrations automatically in Node.js environment requires
TTY (or terminal you can interact with).

Well what `drizzle-kit generate` does, is to generate a set of migration files based on the diff (difference)
calculated from the current specified schema (which you would normally configure in `drizzle.config.ts` with
the property of `schema`) with the journal and snapshots of the schemas (usually the files specified in
`drizzle.config.ts` with property `out`).

Imagine we got this configuration for `drizzle.config.ts` for our local-first or memory app, we are integrating [PGLite](https://pglite.dev):

```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
})
```

and having this `src/db/schema.ts`:

```ts
// Drizzle ORM - PostgreSQL
// https://orm.drizzle.team/docs/get-started/pglite-new

import { bigint, pgTable, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: bigint().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
})
```

After we call `drizzle-kit generate`, it will generate a migration file in `./drizzle` directory, which
consist the following files:

```shell
drizzle
├── 0000_colorful_patch.sql
└── meta
    ├── 0000_snapshot.json
    └── _journal.json

2 directories, 5 files
```

Where `0000_${random_generated_name}.sql` is the migration file, and `meta` directory contains
the snapshot of the schema and journal of the migrations.

One way to achieve the running migrations of the generated files in browser is to leverage the
capability of `vite` and `esbuild` supported `?raw` import syntax, which allows you to import
the content of the file as a string, and then you can execute the SQL statements with the database
connection you initialized in browser.

Still, there leaves some problems for versioned migrations, where you have to implement a basic
storage system to keep track of the applied migrations to avoid running the same migration
multiple times.

The sub-packages in this repository provides a way to both bundle the migrations into a virtual
module like how UnoCSS, and generated file-system based router like `unplugin-vue-router`, as

```ts
import migrations from 'virtual:drizzle-migrations.sql'
```

as well as a browser environment compatible migrator implementation that can apply the migrations
in versioned manner:

```ts
import { IdbFs, PGlite } from '@electric-sql/pglite'
import { migrate } from '@proj-airi/drizzle-orm-browser-migrator/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import migrations from 'virtual:drizzle-migrations.sql'

const pgLite = new PGlite({ fs: new IdbFs('pglite-database') })
const db = drizzle({ client: pgLite })
await migrate(db, migrations)
```

## TypeScript support

Add the following to your `tsconfig.json` to enable type support for the virtual module:

```json
{
  "compilerOptions": {
    "types": [
      "@proj-airi/unplugin-drizzle-orm-migrations/types"
    ]
  }
}
```

> If you like this, do check the Drizzle ORM integrations we made previously for [DuckDB WASM](https://github.com/duckdb/duckdb-wasm) here: [https://github.com/proj-airi/duckdb-wasm](https://github.com/proj-airi/duckdb-wasm)
