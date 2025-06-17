import type { PgliteDatabase } from 'drizzle-orm/pglite'

import { Format, useLogg } from '@guiiai/logg'
import { sql } from 'drizzle-orm'

import packageJSON from '../../package.json' with { type: 'json' }

async function listTables<TSchema extends Record<string, unknown>>(db: PgliteDatabase<TSchema>) {
  const res = await db.execute(sql`
    SELECT
      table_name
    FROM information_schema.tables
    WHERE table_schema = 'public';
  `)

  return res.rows
}

export async function migrate<TSchema extends Record<string, unknown>>(db: PgliteDatabase<TSchema>, bundledMigrations: {
  idx: number
  when: number
  tag: string
  hash: string
  sql: string[]
}[]) {
  const log = useLogg(packageJSON.name).withFormat(Format.Pretty)
  const TABLE_NAME = sql.identifier('__drizzle_migrations')

  await db.execute(
    sql`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id bigserial PRIMARY KEY NOT NULL,
      hash text NOT NULL,
      tag text NOT NULL,
      created_at bigint NOT NULL
    );`,
  )

  const deployments = await db.execute<{
    id: number
    hash: string
    created_at: number
  }>(
    sql`SELECT
      id,
      hash,
      created_at
    FROM ${TABLE_NAME}
    ORDER BY created_at DESC
    LIMIT 1;`,
  )

  const deployment = deployments.rows.at(0)
  const migrations = bundledMigrations.filter((migration) => {
    const timestamp = deployment?.created_at ?? 0
    return !deployment || Number(timestamp) < migration.when
  })
  if (migrations.length === 0) {
    log.withField('tables', await listTables(db)).debug('no pending migrations')
    log.log('no pending migrations to apply')
    return
  }

  await db.transaction(async (tx) => {
    for (let i = 0; i < migrations.length; i++) {
      const migration = migrations[i]

      log.log(`${i + 1}. Deploying migration:`)
      log.log(`     tag  => ${migration.tag}`)
      log.log(`     hash => ${migration.hash}`)
      for (const stmt of migration.sql) {
        await tx.execute(stmt)
      }

      await tx.execute(sql`
        INSERT INTO ${TABLE_NAME} ("hash", "created_at", "tag") VALUES (
          ${sql.raw(`'${migration.hash}'`)},
          ${sql.raw(`${migration.when}`)},
          ${sql.raw(`'${migration.tag}'`)}
        );
      `)
    }
  })

  log.withField('tables', await listTables(db)).debug('migration successful')
  log.log(`all ${migrations.length} pending migrations applied!`)
}
