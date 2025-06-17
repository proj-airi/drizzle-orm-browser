/**
 * This entry file is for Vite plugin.
 *
 * @module
 */

import { DrizzleORMMigrations } from './index'

/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import DrizzleORMMigrations from '@proj-airi/unplugin-drizzle-orm-migrations/vite'
 *
 * export default defineConfig({
 *   plugins: [Unused()],
 * })
 * ```
 */
const vite = DrizzleORMMigrations.vite as typeof DrizzleORMMigrations.vite
export default vite
export { vite as 'module.exports' }
