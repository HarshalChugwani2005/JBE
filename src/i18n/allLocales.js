/**
 * Registers every language synchronously. For Node only (tests, build scripts, vite.config) —
 * importing this in the app would bundle Marathi and Hindi for every visitor.
 */
import en from './locales/en.js'
import hi from './locales/hi.js'
import mr from './locales/mr.js'
import { registerLocale } from './registry.js'

registerLocale('mr', mr)
registerLocale('hi', hi)

export const locales = { en, mr, hi }
