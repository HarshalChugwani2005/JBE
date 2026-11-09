import { categoryLabels, translations } from './translations.js'

export const DEFAULT_LANG = 'en'
export const SUPPORTED_LANGS = Object.keys(translations)

/** Replaces `{name}` placeholders with values from `vars`; unknown placeholders are left as-is. */
export function interpolate(template, vars) {
  if (!vars || typeof template !== 'string') return template
  return template.replace(/\{(\w+)\}/g, (match, name) => (vars[name] ?? match))
}

function lookup(dict, key, vars) {
  if (!dict) return undefined
  if (typeof vars?.count === 'number') {
    const plural = dict[`${key}_${vars.count === 1 ? 'one' : 'other'}`]
    if (plural) return plural
  }
  return dict[key]
}

/**
 * Looks up `key` in the given language, falling back to English and then the key itself.
 * When `vars.count` is a number, `key_one` / `key_other` are preferred if the language defines them.
 */
export function translate(lang, key, vars) {
  const value = lookup(translations[lang], key, vars) ?? lookup(translations[DEFAULT_LANG], key, vars) ?? key
  return interpolate(value, vars)
}

/** Localized category name for a slug, falling back to English, then `fallback`, then the slug. */
export function translateCategory(lang, slug, fallback = '') {
  return categoryLabels[lang]?.[slug] || categoryLabels[DEFAULT_LANG][slug] || fallback || slug
}
