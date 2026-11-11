/**
 * Shared catalog search / filter / sort rules used by the Catalog index and the
 * Category page, so both pages always agree on what matches.
 *
 * Rule: a model is shown when it passes every active filter at once. A category is
 * listed on the Catalog index exactly when its own page would show at least one model.
 *
 * filters: { query, brand, tier, inStockOnly, sort } — the values from useCatalogParams().
 */
import { categoryLabels } from '../i18n/translations.js'

export const isInStock = (model) => model.inStock !== false

export function toQueryWords(query = '') {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean)
}

function matchesWords(parts, words) {
  if (words.length === 0) return true
  const text = parts.filter(Boolean).join(' ').toLowerCase()
  return words.every((word) => text.includes(word))
}

/** Slug, English label and every localized label, so a search in any site language matches. */
function categoryNames(category) {
  return [
    category.category,
    category.categoryLabel,
    ...Object.values(categoryLabels).map((labels) => labels[category.category]),
  ]
}

export function sortModels(models, sort) {
  if (sort === 'stock') return [...models].sort((a, b) => Number(isInStock(b)) - Number(isInStock(a)))
  if (sort === 'name') return [...models].sort((a, b) => a.modelName.localeCompare(b.modelName))
  return models
}

/**
 * Brands of one category that still have matching models, each with its models filtered and sorted.
 * Searchable text per model: category names, brand name / tagline / warranty, model name, specs and colours.
 */
export function filterCategoryBrands(category, filters = {}) {
  const { query = '', brand = '', tier = '', inStockOnly = false, sort = '' } = filters
  const words = toQueryWords(query)
  const brandFilter = brand.trim().toLowerCase()
  const names = categoryNames(category)

  return (category.brands ?? [])
    .map((entry) => {
      if (brandFilter && entry.brand?.toLowerCase() !== brandFilter) return null

      const models = (entry.models ?? []).filter(
        (model) =>
          (!inStockOnly || isInStock(model)) &&
          (!tier || model.priceTier === tier) &&
          matchesWords(
            [...names, entry.brand, entry.tagline, entry.warranty, model.modelName, ...(model.specs ?? []), ...(model.colors ?? [])],
            words,
          ),
      )

      return models.length > 0 ? { ...entry, models: sortModels(models, sort) } : null
    })
    .filter(Boolean)
}

/**
 * Categories for the Catalog index, filtered and sorted.
 * Categories with no models yet (coming soon) match on their names only, and only when
 * no brand / tier / stock filter is active.
 *
 * @param {(category) => string} labelOf  display label, used for name sorting
 * @param {string} locale                 locale for name sorting (the site language)
 */
export function filterCatalog(categories, filters = {}, { labelOf = (category) => category.categoryLabel, locale } = {}) {
  const { brand = '', tier = '', inStockOnly = false, query = '', sort = '' } = filters

  const visible = categories.filter((category) => {
    const hasModels = category.brands?.some((entry) => entry.models?.length)
    if (!hasModels) {
      if (brand || tier || inStockOnly) return false
      return matchesWords(categoryNames(category), toQueryWords(query))
    }
    return filterCategoryBrands(category, filters).length > 0
  })

  if (sort === 'name') return [...visible].sort((a, b) => labelOf(a).localeCompare(labelOf(b), locale))
  if (sort === 'stock') {
    const anyInStock = (category) => category.brands?.some((entry) => entry.models?.some(isInStock))
    return [...visible].sort((a, b) => Number(anyInStock(b)) - Number(anyInStock(a)))
  }
  return visible
}
