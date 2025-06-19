# Drizzle ORM Browser Utilities

> [!NOTE]
>
> This project is part of (and also associate to) the [Project AIRI](https://github.com/moeru-ai/airi),
> we aim to build a LLM-driven VTuber like [Neuro-sama](https://www.youtube.com/@Neurosama) (subscribe
>  if you didn't!) if you are interested in, please do give it a try on [live demo](https://airi.moeru.ai).

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

## Packages

- [`@proj-airi/drizzle-orm-browser-migrator`](https://github.com/proj-airi/drizzle-orm-browser/tree/main/packages/drizzle-orm-browser-migrator): 🦆 Drizzle ORM migrator applies migrations in browser environment, for PGLite, SQLite, DuckDB WASM!
- [`@proj-airi/unplugin-drizzle-orm-migrations`](https://github.com/proj-airi/drizzle-orm-browser/tree/main/packages/unplugin-drizzle-orm-migrations): 🦆 Drizzle ORM migrations bundler plugin for bundling drizzle-kit migrations!

### Development

```bash
pnpm dev
```

## Other side projects born from Project AIRI

- [Awesome AI VTuber](https://github.com/proj-airi/awesome-ai-vtuber): A curated list of AI VTubers and related projects
- [`unspeech`](https://github.com/moeru-ai/unspeech): Universal endpoint proxy server for `/audio/transcriptions` and `/audio/speech`, like LiteLLM but for any ASR and TTS
- [`hfup`](https://github.com/moeru-ai/hfup): tools to help on deploying, bundling to HuggingFace Spaces
- [`xsai-transformers`](https://github.com/moeru-ai/xsai-transformers): Experimental [🤗 Transformers.js](https://github.com/huggingface/transformers.js) provider for [xsAI](https://github.com/moeru-ai/xsai).
- [WebAI: Realtime Voice Chat](https://github.com/proj-airi/webai-realtime-voice-chat): Full example of implementing ChatGPT's realtime voice from scratch with VAD + STT + LLM + TTS.
- [`@proj-airi/drizzle-duckdb-wasm`](https://github.com/moeru-ai/airi/tree/main/packages/drizzle-duckdb-wasm/README.md): Drizzle ORM driver for DuckDB WASM
- [`@proj-airi/duckdb-wasm`](https://github.com/moeru-ai/airi/tree/main/packages/duckdb-wasm/README.md): Easy to use wrapper for `@duckdb/duckdb-wasm`
- [Airi Factorio](https://github.com/moeru-ai/airi-factorio): Allow Airi to play Factorio
- [Factorio RCON API](https://github.com/nekomeowww/factorio-rcon-api): RESTful API wrapper for Factorio headless server console
- [`autorio`](https://github.com/moeru-ai/airi-factorio/tree/main/packages/autorio): Factorio automation library
- [`tstl-plugin-reload-factorio-mod`](https://github.com/moeru-ai/airi-factorio/tree/main/packages/tstl-plugin-reload-factorio-mod): Reload Factorio mod when developing
- [Velin](https://github.com/luoling8192/velin): Use Vue SFC and Markdown to write easy to manage stateful prompts for LLM
- [`demodel`](https://github.com/moeru-ai/demodel): Easily boost the speed of pulling your models and datasets from various of inference runtimes.
- [`inventory`](https://github.com/moeru-ai/inventory): Centralized model catalog and default provider configurations backend service
- [MCP Launcher](https://github.com/moeru-ai/mcp-launcher): Easy to use MCP builder & launcher for all possible MCP servers, just like Ollama for models!
- [🥺 SAD](https://github.com/moeru-ai/sad): Documentation and notes for self-host and browser running LLMs.

## Acknowledgements

- Comments under [FEATURE]: Running Migrations in the Browser for Local-First Apps: https://github.com/drizzle-team/drizzle-orm/issues/1009
- Especially https://github.com/drizzle-team/drizzle-orm/issues/1009#issuecomment-2454115147
