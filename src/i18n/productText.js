/**
 * Display text for catalog data (specs, colours, brand taglines, warranty).
 *
 * src/data/products.js stays English: it is the source of truth, what the shop sees in
 * WhatsApp enquiries, and colour names are matched to product photos. Translations live in
 * the `products` map of src/i18n/locales/mr.js and hi.js, keyed by the English text.
 * test/i18n.test.js fails if a catalog string has no Marathi or Hindi text.
 */
import { getLocale, loadedLocales } from './registry.js'

/** Display text for a catalog string in the given language (English text is returned unchanged). */
export function translateProductText(lang, text) {
  if (!text) return text
  return getLocale(lang)?.products?.[text] ?? text
}

/** The English text plus its translation in every loaded language — so search matches in any of them. */
export function productTextVariants(text) {
  if (!text) return []
  return [text, ...Object.values(loadedLocales()).map((locale) => locale.products?.[text]).filter(Boolean)]
}
