import { useSearchParams } from 'react-router-dom'

/**
 * Shared hook for catalog filter URL params.
 * Used by both Catalog page and CategoryPage to avoid duplicating
 * the updateParams / clearFilters logic.
 */
export function useCatalogParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query      = searchParams.get('q')       ?? ''
  const brand      = searchParams.get('brand')   ?? ''
  const tier       = searchParams.get('tier')    ?? ''
  const sort       = searchParams.get('sort')    ?? ''
  const inStockOnly = searchParams.get('inStock') === '1'

  const updateParams = (next) => {
    const params = new URLSearchParams(searchParams)

    const nextQuery   = next.q       !== undefined ? next.q       : query
    const nextBrand   = next.brand   !== undefined ? next.brand   : brand
    const nextTier    = next.tier    !== undefined ? next.tier    : tier
    const nextInStock = next.inStock !== undefined ? next.inStock : inStockOnly
    const nextSort    = next.sort    !== undefined ? next.sort    : sort

    if (nextQuery.trim())   params.set('q', nextQuery)   ; else params.delete('q')
    if (nextBrand.trim())   params.set('brand', nextBrand); else params.delete('brand')
    if (nextTier.trim())    params.set('tier', nextTier)  ; else params.delete('tier')
    if (nextInStock)        params.set('inStock', '1')    ; else params.delete('inStock')
    if (nextSort.trim())    params.set('sort', nextSort)  ; else params.delete('sort')

    setSearchParams(params, { replace: true })
  }

  const clearFilters = () => setSearchParams(new URLSearchParams(), { replace: true })

  return { query, brand, tier, sort, inStockOnly, updateParams, clearFilters }
}
