export function splitSQL(sql: string) {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
    .split(/\r?\n\t?/g)
    .map(line => line.replace(/^--.*$/g, '')) // remove comments
    .map(line => line.replace('--> statement-breakpoint', '')) // remove statement-breakpoints
    .map(line => line.trim())
    .join(' ')
    .replaceAll(';', ';\n')
    .split('\n')
    .map(x => x.trim())
    .filter(Boolean)
}
