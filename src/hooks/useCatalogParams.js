import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { isHydrating } from '../utils/hydration'

const SORT_OPTIONS = new Set(['', 'name'])
const NO_PARAMS = new URLSearchParams()

/**
 * Shared hook for catalog filter URL params (?q=, ?brand=, ?tier=, ?sort=).
 * Used by both Catalog page and CategoryPage to avoid duplicating
 * the updateParams / clearFilters logic.
 *
 * Pages are pre-rendered without a query string, so during hydration this returns the
 * unfiltered defaults (matching the HTML exactly); the real filters apply right after mount.
 * `search` is the query string to carry on links, deferred the same way.
 */
export function useCatalogParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [mounted, setMounted] = useState(() => !isHydrating())
  useEffect(() => setMounted(true), [])

  const params = mounted ? searchParams : NO_PARAMS
  const query = params.get('q') ?? ''
  const brand = params.get('brand') ?? ''
  const tier = params.get('tier') ?? ''
  // Unknown values (e.g. the retired `sort=stock` from old shared links) fall back to the default order.
  const rawSort = params.get('sort') ?? ''
  const sort = SORT_OPTIONS.has(rawSort) ? rawSort : ''
  const search = mounted ? location.search : ''

  const updateParams = (next) => {
    const nextParams = new URLSearchParams(searchParams)
    // Drop the retired stock filter from old shared links.
    nextParams.delete('inStock')

    const nextQuery = next.q !== undefined ? next.q : query
    const nextBrand = next.brand !== undefined ? next.brand : brand
    const nextTier = next.tier !== undefined ? next.tier : tier
    const nextSort = next.sort !== undefined ? next.sort : sort

    if (nextQuery.trim()) nextParams.set('q', nextQuery); else nextParams.delete('q')
    if (nextBrand.trim()) nextParams.set('brand', nextBrand); else nextParams.delete('brand')
    if (nextTier.trim()) nextParams.set('tier', nextTier); else nextParams.delete('tier')
    if (nextSort.trim()) nextParams.set('sort', nextSort); else nextParams.delete('sort')

    setSearchParams(nextParams, { replace: true })
  }

  const clearFilters = () => setSearchParams(new URLSearchParams(), { replace: true })

  return { query, brand, tier, sort, search, updateParams, clearFilters }
}
