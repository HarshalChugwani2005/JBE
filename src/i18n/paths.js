/**
 * Language lives in the URL so every language has its own crawlable address:
 *   English  /catalog/ceiling-fans
 *   Marathi  /mr/catalog/ceiling-fans
 *   Hindi    /hi/catalog/ceiling-fans
 * Routes and links are written without a prefix; these helpers add / remove it.
 */
import { DEFAULT_LANG, SUPPORTED_LANGS } from './registry.js'

const PREFIXED = SUPPORTED_LANGS.filter((lang) => lang !== DEFAULT_LANG)
const PREFIX_RE = new RegExp(`^/(${PREFIXED.join('|')})(?=/|$)`)

/** Language encoded in a pathname ('/mr/catalog' → 'mr', '/catalog' → 'en'). */
export function langFromPath(pathname = '/') {
  return pathname.match(PREFIX_RE)?.[1] ?? DEFAULT_LANG
}

/** Pathname without its language prefix ('/mr/catalog' → '/catalog', '/mr' → '/'). */
export function stripLang(pathname = '/') {
  return pathname.replace(PREFIX_RE, '') || '/'
}

/** Adds the language prefix to an unprefixed path ('/catalog' + 'mr' → '/mr/catalog', '/' + 'mr' → '/mr'). */
export function withLang(lang, path = '/') {
  if (!lang || lang === DEFAULT_LANG) return path
  return path === '/' ? `/${lang}` : `/${lang}${path}`
}

/** Path prefixes the router mounts the routes under ('' for English). */
export const ROUTE_PREFIXES = SUPPORTED_LANGS.map((lang) => withLang(lang, '/').replace(/^\/$/, ''))
