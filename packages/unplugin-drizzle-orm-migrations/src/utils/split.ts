export function splitSQL(sql: string) {
  return sql.split(/\n\t?/g)
    .map(line => line.replace(/--.*$/, '')) // strip inline `-- ...` comments
    .map(line => line.replace(/\/\*.*?\*\//g, '')) // strip single-line `/* ... */` comments
    .map(line => line.trim()) //
    .join(' ')
    .replaceAll(';', ';\n')
    .split('\n')
    .map(x => x.trim())
    .filter(Boolean)
}
