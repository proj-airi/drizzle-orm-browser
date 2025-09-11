declare module 'virtual:drizzle-migrations.sql' {
  interface Migration {
    idx: number
    when: number
    tag: string
    hash: string
    sql: string[]
  }

  const migrations: Migration[]
  export default migrations
}

declare module 'drizzle-migrations.sql' {
  interface Migration {
    idx: number
    when: number
    tag: string
    hash: string
    sql: string[]
  }

  const migrations: Migration[]
  export default migrations
}
