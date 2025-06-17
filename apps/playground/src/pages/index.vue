<script setup lang="ts">
import { PGlite } from '@electric-sql/pglite'
import { IdbFs } from '@electric-sql/pglite'
import { migrate } from '@proj-airi/drizzle-orm-browser-migrator/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import migrations from 'virtual:drizzle-migrations.sql'
import { onMounted, ref } from 'vue'

import type { usersTable } from '../db/schema'

import * as schema from '../db/schema'

const results = ref<typeof usersTable.$inferSelect[]>([])

onMounted(async () => {
  const pgLite = new PGlite({ fs: new IdbFs('pglite-database') })

  const db = drizzle({ client: pgLite, schema })
  await migrate(db, migrations)
  await db.insert(schema.usersTable).values({
    name: 'Alice',
    age: 18,
    email: `${Math.random().toString(36).substring(2, 15)}@example.com`,
  })

  results.value = await db.select().from(schema.usersTable)
})

function clearDatabase() {
  indexedDB.deleteDatabase('/pglite/pglite-database')
  results.value = []
}
</script>

<template>
  <div style="white-space: pre-wrap;" max-h-80dvh overflow-y-scroll font-mono>
    {{ JSON.stringify(results, null, 2) }}
  </div>
  <div>
    <button rounded-lg bg-neutral-500 px-3 py-2 @click="clearDatabase">
      Clear Database
    </button>
  </div>
</template>
