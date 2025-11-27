/**
 * This entry file is for Vite plugin.
 *
 * @module
 */

import { newPlugin } from './index'

/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import DrizzleORMMigrations from '@proj-airi/unplugin-drizzle-orm-migrations/vite'
 *
 * export default defineConfig({
 *   plugins: [DrizzleORMMigrations()],
 * })
 * ```
 */
const vite = newPlugin().vite
export default vite
export { vite as 'module.exports' }
