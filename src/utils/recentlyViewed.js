const STORAGE_KEY = 'jbe_recently_viewed_v1'
const MAX_ITEMS = 8

export function getRecentlyViewed() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to read recently viewed:', err)
    return []
  }
}

export function addRecentlyViewed(item) {
  if (typeof window === 'undefined' || !item?.modelName || !item?.categorySlug) return

  try {
    const current = getRecentlyViewed()
    const id = `${item.categorySlug}-${item.brand || ''}-${item.modelName}`

    // Remove if already exists so it jumps to the front
    const filtered = current.filter((x) => x.id !== id)

    const updated = [
      {
        id,
        categorySlug: item.categorySlug,
        categoryLabel: item.categoryLabel || item.categorySlug,
        brand: item.brand?.brand || item.brand || '',
        modelName: item.modelName,
        image: item.image || item.model?.image || null,
        inStock: item.inStock !== false,
        priceTier: item.priceTier || item.model?.priceTier || null,
        viewedAt: Date.now(),
      },
      ...filtered,
    ].slice(0, MAX_ITEMS)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('jbe:recently-viewed-updated', { detail: updated }))
  } catch (err) {
    console.error('Failed to save recently viewed:', err)
  }
}

export function clearRecentlyViewed() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('jbe:recently-viewed-updated', { detail: [] }))
  } catch (err) {
    console.error('Failed to clear recently viewed:', err)
  }
}
