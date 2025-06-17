import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cwd, env } from 'node:process'

import { subtle } from 'uncrypto'
import { createUnplugin, type UnpluginInstance } from 'unplugin'

const VirtualModuleID = 'virtual:drizzle-migrations.sql'
const ResolvedVirtualModuleId = `\0${VirtualModuleID}`

import { loadConfig } from 'c12'

export const DrizzleORMMigrations: UnpluginInstance<{ root?: string } | undefined, false>
  = createUnplugin((rawOptions = { root: cwd() }) => {
    const options = rawOptions || { root: cwd() }

    if (options.root == null)
      options.root = cwd()
    let _drizzleConfig: {
      out?: string | null
      schema?: string | null
      dialect?: string | null
    }

    const migrateSQLFileContents: {
      idx: number
      when: number
      tag: string
      hash: string
      sql: string[]
    }[] = []

    return {
      name: 'drizzle-migrations',
      buildStart: async () => {
        const drizzleConfig = await loadConfig({
          name: 'drizzle',
          cwd: options.root,
        })

        _drizzleConfig = drizzleConfig.config
        if (!_drizzleConfig.out)
          return

        const journalJSONContent = (await readFile(join(_drizzleConfig.out, 'meta/_journal.json'))).toString('utf-8')
        const journal = JSON.parse(journalJSONContent) as {
          entries: {
            idx: number
            version: string
            when: number
            tag: string
            breakpoints: boolean
          }[]
        }

        for (let index = 0; index < journal.entries.length; index++) {
          const { when, idx, tag } = journal.entries[index]
          const migrateSQLFilePath = join(_drizzleConfig.out, `${tag}.sql`)
          const migrateSQLFileContent = (await readFile(migrateSQLFilePath)).toString('utf-8')

          migrateSQLFileContents.push({
            idx,
            when,
            tag,
            hash: Buffer.from((await subtle.digest({ name: 'SHA-256' }, Buffer.from(migrateSQLFileContent, 'utf-8')))).toString('hex'),
            sql: migrateSQLFileContent
              .replace(/\n\t?/g, '')
              .split('--> statement-breakpoint')
              .map(x => x.trim()),
          })
        }
      },
      resolveId(source) {
        if (source.startsWith(VirtualModuleID))
          return `\0${source}`
      },
      load(id) {
        if (!id.startsWith(ResolvedVirtualModuleId))
          return null
        if (!_drizzleConfig.out)
          return null

        return `export default ${JSON.stringify(migrateSQLFileContents, null, env.NODE_ENV === 'production' ? 0 : 2)}`
      },
    }
  })
