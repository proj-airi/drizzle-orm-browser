import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import { Format, useLogg } from '@guiiai/logg'
import { sql } from 'drizzle-orm'

import packageJSON from '../../package.json' with { type: 'json' }

async function listTables<TSchema extends Record<string, unknown>>(db: PostgresJsDatabase<TSchema>) {
  const res = await db.execute(sql`
    SELECT
      table_name
    FROM information_schema.tables
    WHERE table_schema = 'public';
  `)

  return res.rows
}

export async function migrate<TSchema extends Record<string, unknown>>(db: PostgresJsDatabase<TSchema>, bundledMigrations: {
  idx: number
  when: number
  tag: string
  hash: string
  sql: string[]
}[]) {
  const log = useLogg(packageJSON.name).withFormat(Format.Pretty)

  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS drizzle;`)
  const TABLE_NAME = sql.identifier('__drizzle_migrations')

  await db.execute(
    sql`CREATE TABLE IF NOT EXISTS drizzle.${TABLE_NAME} (
      id bigserial PRIMARY KEY NOT NULL,
      hash text NOT NULL,
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
    FROM drizzle.${TABLE_NAME}
    ORDER BY created_at DESC
    LIMIT 1;`,
  )

  const deployment = deployments[0]
  const migrations = bundledMigrations.filter((migration) => {
    const timestamp = deployment?.created_at ?? 0
    return !deployment || Number(timestamp) < migration.when
  })
  if (migrations.length === 0) {
    log.withField('tables', await listTables(db)).debug('no pending migrations')
    log.debug('no pending migrations to apply')
    return
  }

  await db.transaction(async (tx) => {
    for (let i = 0; i < migrations.length; i++) {
      const migration = migrations[i]

      log.debug(`${i + 1}. Deploying migration:`)
      log.debug(`     hash => ${migration.hash}`)
      for (const stmt of migration.sql) {
        await tx.execute(stmt)
      }

      await tx.execute(sql`
        INSERT INTO drizzle.${TABLE_NAME} ("hash", "created_at") VALUES (
          ${sql.raw(`'${migration.hash}'`)},
          ${sql.raw(`${migration.when}`)}
        );
      `)
    }
  })

  log.withField('tables', await listTables(db)).debug('migration successful')
  log.debug(`all ${migrations.length} pending migrations applied!`)
}
