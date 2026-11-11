import { useSearchParams } from 'react-router-dom'

const SORT_OPTIONS = new Set(['', 'name'])

/**
 * Shared hook for catalog filter URL params.
 * Used by both Catalog page and CategoryPage to avoid duplicating
 * the updateParams / clearFilters logic.
 */
export function useCatalogParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') ?? ''
  const brand = searchParams.get('brand') ?? ''
  const tier = searchParams.get('tier') ?? ''
  // Unknown values (e.g. the retired `sort=stock` from old shared links) fall back to the default order.
  const rawSort = searchParams.get('sort') ?? ''
  const sort = SORT_OPTIONS.has(rawSort) ? rawSort : ''

  const updateParams = (next) => {
    const params = new URLSearchParams(searchParams)
    // Drop the retired stock filter from old shared links.
    params.delete('inStock')

    const nextQuery = next.q !== undefined ? next.q : query
    const nextBrand = next.brand !== undefined ? next.brand : brand
    const nextTier = next.tier !== undefined ? next.tier : tier
    const nextSort = next.sort !== undefined ? next.sort : sort

    if (nextQuery.trim()) params.set('q', nextQuery); else params.delete('q')
    if (nextBrand.trim()) params.set('brand', nextBrand); else params.delete('brand')
    if (nextTier.trim()) params.set('tier', nextTier); else params.delete('tier')
    if (nextSort.trim()) params.set('sort', nextSort); else params.delete('sort')

    setSearchParams(params, { replace: true })
  }

  const clearFilters = () => setSearchParams(new URLSearchParams(), { replace: true })

  return { query, brand, tier, sort, updateParams, clearFilters }
}
