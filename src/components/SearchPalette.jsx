import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../context/useSearch'
import { useLanguage } from '../context/useLanguage'
import { categories } from '../data/products'
import { getCategoryVisual, getModelCount } from '../data/categoryVisuals'
import CategoryIcon from './CategoryIcon'
import ProductImage from './ProductImage'

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export default function SearchPalette() {
  const { isOpen, closeSearch } = useSearch()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Flatten all categories and products for instant search
  const { allCategories, allProducts } = useMemo(() => {
    const cats = []
    const prods = []

    for (const cat of categories) {
      cats.push({
        type: 'category',
        id: `cat-${cat.category}`,
        categorySlug: cat.category,
        categoryLabel: cat.categoryLabel,
        brandCount: cat.brands?.length || 0,
        modelCount: getModelCount({ brands: cat.brands || [] }),
        comingSoon: cat.comingSoon,
        visual: getCategoryVisual(cat.category),
      })

      if (cat.comingSoon) continue

      for (const b of cat.brands || []) {
        for (const m of b.models || []) {
          prods.push({
            type: 'product',
            id: `prod-${cat.category}-${slugify(b.brand)}-${slugify(m.modelName)}`,
            modelName: m.modelName,
            brand: b.brand,
            categorySlug: cat.category,
            categoryLabel: cat.categoryLabel,
            image: m.image,
            images: m.images,
            inStock: m.inStock !== false,
            specs: m.specs || [],
            colors: m.colors || [],
            warranty: m.warranty || b.warranty,
          })
        }
      }
    }

    return { allCategories: cats, allProducts: prods }
  }, [])

  // Filter items based on query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      // Default initial view: top categories and featured products
      return [
        ...allCategories.slice(0, 4),
        ...allProducts.slice(0, 6),
      ]
    }

    const words = q.split(/\s+/).filter(Boolean)

    const matchedCats = allCategories.filter((cat) => {
      const text = `${cat.categoryLabel} ${cat.categorySlug}`.toLowerCase()
      return words.every((w) => text.includes(w))
    })

    const matchedProds = allProducts.filter((prod) => {
      const text = `${prod.brand} ${prod.modelName} ${prod.categoryLabel} ${prod.specs.join(' ')} ${prod.colors.join(' ')}`.toLowerCase()
      return words.every((w) => text.includes(w))
    })

    return [...matchedCats, ...matchedProds]
  }, [allCategories, allProducts, query])

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      document.body.classList.add('overflow-hidden')
      return () => {
        clearTimeout(timer)
        document.body.classList.remove('overflow-hidden')
      }
    }
  }, [isOpen])

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return
    const activeEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`)
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  if (!isOpen) return null

  const handleSelect = (item) => {
    closeSearch()
    if (item.type === 'category') {
      navigate(`/catalog/${item.categorySlug}`)
    } else {
      navigate(`/catalog/${item.categorySlug}/${slugify(item.modelName)}`)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      closeSearch()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex])
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-md p-3 sm:p-6 md:p-12 transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSearch()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Global Search Palette"
    >
      <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] ring-1 ring-stone-200/90 animate-modal-pop">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-stone-200/80 px-4 py-3.5 sm:px-6">
          <span className="text-stone-400 text-lg sm:text-xl mr-3" aria-hidden="true">
            🔍
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('searchPlaceholder') || 'Search fans, coolers, appliances, brands...'}
            className="w-full bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 outline-none"
            aria-autocomplete="list"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          <button
            type="button"
            onClick={closeSearch}
            className="ml-2 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-stone-500 hover:border-amber-300 hover:text-stone-900 transition"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-3 sm:p-4 space-y-1.5">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-stone-500">
              <span className="text-3xl">🔎</span>
              <p className="mt-3 font-semibold text-stone-700">No matching products or categories</p>
              <p className="mt-1 text-xs text-stone-400">
                Try searching for "ZIPSY", "Titan", "Fan", "Cooler", or "Havells"
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex

              if (item.type === 'category') {
                return (
                  <div
                    key={item.id}
                    data-index={index}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center gap-3.5 rounded-2xl p-3 cursor-pointer transition duration-150 ${
                      isSelected
                        ? 'bg-amber-500/10 border border-amber-500/40 text-amber-950'
                        : 'hover:bg-stone-50 border border-transparent text-stone-800'
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.visual.gradient} text-white shadow-xs`}
                    >
                      <CategoryIcon slug={item.categorySlug} className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm truncate">
                          {item.categoryLabel}
                        </span>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                          Category
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 truncate">
                        {item.comingSoon
                          ? 'Coming soon'
                          : `${item.modelCount} model${item.modelCount === 1 ? '' : 's'} available`}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-700 opacity-60 group-hover:opacity-100">
                      Jump →
                    </span>
                  </div>
                )
              }

              return (
                <div
                  key={item.id}
                  data-index={index}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center gap-3.5 rounded-2xl p-3 cursor-pointer transition duration-150 ${
                    isSelected
                      ? 'bg-amber-500/10 border border-amber-500/40 text-amber-950'
                      : 'hover:bg-stone-50 border border-transparent text-stone-800'
                  }`}
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xs">
                    <ProductImage
                      category={item.categorySlug}
                      product={item}
                      alt={item.modelName}
                      className="h-full w-full object-cover"
                      fallbackLabel=""
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-stone-900 truncate">
                        {item.brand ? `${item.brand} ` : ''}{item.modelName}
                      </span>
                      {item.inStock ? (
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          In Stock
                        </span>
                      ) : (
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500 truncate">
                      <span className="font-medium text-amber-800/90">{item.categoryLabel}</span>
                      {item.specs?.[0] && (
                        <>
                          <span>•</span>
                          <span className="truncate">{item.specs[0]}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-700">
                    View Specs →
                  </span>
                </div>
              )
            })
          )}
        </div>

        {/* Keyboard Shortcuts Helper Footer */}
        <div className="flex flex-wrap items-center justify-between border-t border-stone-200/80 bg-stone-50/70 px-4 py-2.5 sm:px-6 text-[11px] text-stone-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-stone-300 bg-white px-1 py-0.5 font-mono text-[10px]">↑</kbd>
              <kbd className="rounded border border-stone-300 bg-white px-1 py-0.5 font-mono text-[10px]">↓</kbd> to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[10px]">↵</kbd> to select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-stone-300 bg-white px-1 py-0.5 font-mono text-[10px]">esc</kbd> to close
            </span>
          </div>
          <span className="hidden sm:inline font-medium text-stone-400">
            Jai Baba Electronic Catalog
          </span>
        </div>
      </div>
    </div>
  )
}
