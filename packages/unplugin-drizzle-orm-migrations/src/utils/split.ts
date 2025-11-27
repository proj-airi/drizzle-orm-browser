export function splitSQL(sql: string) {
  return sql.replace(/\/\*[\s\S]*?\*\//g, '')
    .split(/\r?\n\t?/g)
    .map(line => line.replace(/^--.*$/g, ''))
    .map(line => line.replace('--> statement-breakpoint', ''))
    .map(line => line.trim())
    .join(' ')
    .replaceAll(';', ';\n')
    .split('\n')
    .map(x => x.trim())
    .filter(Boolean)
}
