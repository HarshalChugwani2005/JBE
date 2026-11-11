/**
 * Language registry. English is bundled; Marathi and Hindi are separate chunks loaded on
 * demand, so English visitors never download them.
 *
 * - Browser: main.jsx awaits loadLocale(<language in the URL>) before rendering, and the
 *   language switcher awaits it before navigating, so text never flashes in English.
 * - Node (tests, build scripts): import './allLocales.js' to register every language at once.
 */
import en from './locales/en.js'

export const DEFAULT_LANG = 'en'
export const SUPPORTED_LANGS = ['en', 'mr', 'hi']

const loaders = {
  mr: () => import('./locales/mr.js'),
  hi: () => import('./locales/hi.js'),
}

const loaded = { en }
const pending = {}

export function registerLocale(lang, data) {
  loaded[lang] = data
}

export function getLocale(lang) {
  return loaded[lang]
}

export function isLocaleLoaded(lang) {
  return Boolean(loaded[lang])
}

/** Every language currently in memory (always includes English). */
export function loadedLocales() {
  return loaded
}

/** Loads a language's strings (no-op if already loaded). Resolves to the locale data. */
export function loadLocale(lang) {
  if (loaded[lang]) return Promise.resolve(loaded[lang])
  if (!loaders[lang]) return Promise.resolve(loaded[DEFAULT_LANG])
  pending[lang] ??= loaders[lang]().then((module) => {
    loaded[lang] = module.default
    return module.default
  })
  return pending[lang]
}
