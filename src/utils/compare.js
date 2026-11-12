import { categories } from '../data/products.js'
import { slugify } from './slugify.js'

/**
 * Product comparison helpers (pure, no React) — shared by the compare context, the compare page
 * and the tests.
 *
 * A comparison holds up to COMPARE_MAX models from ONE category (comparing a fan with a geyser
 * says nothing useful). Entries are stored as { categorySlug, modelSlug } so saved lists and
 * shared links survive catalog text changes as long as the model URL stays the same.
 */
export const COMPARE_MAX = 3

/** Catalog entry for a category + model slug: { category, brand, model } or null. */
export function findModel(categorySlug, modelSlug) {
  const category = categories.find((c) => c.category === categorySlug)
  for (const brand of category?.brands ?? []) {
    const model = (brand.models ?? []).find((m) => slugify(m.modelName) === modelSlug)
    if (model) return { category, brand, model }
  }
  return null
}

export const sameEntry = (a, b) => a.categorySlug === b.categorySlug && a.modelSlug === b.modelSlug

/** Keeps only real catalog models from one category (the first entry's), without duplicates, max 3. */
export function sanitizeCompareList(list) {
  if (!Array.isArray(list)) return []
  const valid = list.filter(
    (entry) => entry && typeof entry.categorySlug === 'string' && typeof entry.modelSlug === 'string' && findModel(entry.categorySlug, entry.modelSlug),
  )
  const categorySlug = valid[0]?.categorySlug
  const result = []
  for (const entry of valid) {
    if (entry.categorySlug !== categorySlug || result.some((e) => sameEntry(e, entry))) continue
    result.push({ categorySlug: entry.categorySlug, modelSlug: entry.modelSlug })
    if (result.length === COMPARE_MAX) break
  }
  return result
}

/**
 * Adds or removes a model.
 * outcome: 'added' | 'removed' | 'replaced' (other category → a new comparison starts) | 'full'.
 */
export function toggleCompareEntry(list, entry) {
  if (list.some((e) => sameEntry(e, entry))) return { list: list.filter((e) => !sameEntry(e, entry)), outcome: 'removed' }
  if (list.length > 0 && list[0].categorySlug !== entry.categorySlug) return { list: [entry], outcome: 'replaced' }
  if (list.length >= COMPARE_MAX) return { list, outcome: 'full' }
  return { list: [...list, entry], outcome: 'added' }
}

/** Query string for a shareable comparison link: ?c=ceiling-fans&m=titan,bounce */
export function compareSearch(list) {
  if (list.length === 0) return ''
  const params = new URLSearchParams({ c: list[0].categorySlug, m: list.map((e) => e.modelSlug).join(',') })
  return `?${params.toString()}`
}

/** Reads a shared comparison link; returns null when the URL holds no comparison. */
export function parseCompareSearch(search) {
  const params = new URLSearchParams(search)
  const categorySlug = params.get('c')
  const models = params.get('m')
  if (!categorySlug || !models) return null
  return sanitizeCompareList(models.split(',').map((modelSlug) => ({ categorySlug, modelSlug: modelSlug.trim() })))
}
