import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../context/useSearch'
import { useLanguage } from '../context/useLanguage'
import { categories } from '../data/products'
import { getCategoryVisual, getModelCount } from '../data/categoryVisuals'
import CategoryIcon from './CategoryIcon'
import { CloseIcon, SearchIcon } from './Icons'
import ProductImage from './ProductImage'
import { slugify } from '../utils/slugify'
import { shop } from '../data/site'
import { trapTabKey } from '../utils/focus'
import { categoryLabels } from '../i18n/translations'

// ─── Static search index ──────────────────────────────────────────────────────
// Built once at module load time (data is static) — not inside the component
// so it isn't reconstructed on every SearchPalette mount.
function allCategoryLabels(slug) {
  return Object.values(categoryLabels)
    .map((labels) => labels[slug])
    .filter(Boolean)
    .join(' ')
}

function buildSearchIndex() {
  const cats = []
  const prods = []

  for (const cat of categories) {
    cats.push({
      type: 'category',
      id: `cat-${cat.category}`,
      categorySlug: cat.category,
      categoryLabel: cat.categoryLabel,
      searchLabels: allCategoryLabels(cat.category),
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
          searchLabels: allCategoryLabels(cat.category),
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
}

const { allCategories: ALL_CATEGORIES, allProducts: ALL_PRODUCTS } = buildSearchIndex()
// ─────────────────────────────────────────────────────────────────────────────

export default function SearchPalette() {
  const { isOpen, closeSearch } = useSearch()
  const { t, tCategory } = useLanguage()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const dialogRef = useRef(null)
  const previouslyFocusedRef = useRef(null)

  // Filter items based on query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return [
        ...ALL_CATEGORIES.slice(0, 4),
        ...ALL_PRODUCTS.slice(0, 6),
      ]
    }

    const words = q.split(/\s+/).filter(Boolean)

    const matchedCats = ALL_CATEGORIES.filter((cat) => {
      const text = `${cat.categoryLabel} ${cat.searchLabels} ${cat.categorySlug}`.toLowerCase()
      return words.every((w) => text.includes(w))
    })

    const matchedProds = ALL_PRODUCTS.filter((prod) => {
      const text = `${prod.brand} ${prod.modelName} ${prod.categoryLabel} ${prod.searchLabels} ${prod.specs.join(' ')} ${prod.colors.join(' ')}`.toLowerCase()
      return words.every((w) => text.includes(w))
    })

    return [...matchedCats, ...matchedProds]
  }, [query])

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement
      setQuery('')
      setSelectedIndex(0)
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      document.body.classList.add('overflow-hidden')
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          closeSearch()
          return
        }
        trapTabKey(event, dialogRef.current)
      }

      document.addEventListener('keydown', handleKeyDown)

      return () => {
        clearTimeout(timer)
        document.removeEventListener('keydown', handleKeyDown)
        document.body.classList.remove('overflow-hidden')
        previouslyFocusedRef.current?.focus?.()
      }
    }
  }, [isOpen, closeSearch])

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
    // Escape is handled by the dialog-level keydown listener.
    if (e.key === 'ArrowDown') {
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
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 p-3 sm:p-6 md:p-12 transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSearch()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('searchDialogLabel')}
        className="mx-auto max-w-2xl overflow-hidden rounded-3xl bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] ring-1 ring-stone-200/90 animate-modal-pop">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-stone-200/80 px-4 py-3.5 sm:px-6">
          <SearchIcon className="h-5 w-5 text-stone-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchDialogLabel')}
            role="combobox"
            aria-expanded="true"
            className="w-full bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-500 outline-none"
            aria-autocomplete="list"
            aria-controls="search-palette-results"
            aria-activedescendant={
              filteredItems.length > 0 ? `search-result-${selectedIndex}` : undefined
            }
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer"
              aria-label={t('clearSearch')}
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={closeSearch}
            className="ml-2 min-h-9 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-stone-600 hover:border-amber-300 hover:text-stone-900 transition cursor-pointer"
            aria-label={t('close')}
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          id="search-palette-results"
          role="listbox"
          aria-label={t('searchResults')}
          className="max-h-[60vh] overflow-y-auto p-3 sm:p-4 space-y-1.5"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-stone-500">
              <SearchIcon className="mx-auto h-10 w-10 text-stone-400" />
              <p className="mt-3 font-semibold text-stone-700">{t('searchNoResults')}</p>
              <p className="mt-1 text-xs text-stone-600">{t('searchNoResultsHint')}</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex

              if (item.type === 'category') {
                return (
                  <div
                    key={item.id}
                    id={`search-result-${index}`}
                    data-index={index}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center gap-3.5 rounded-2xl p-3 cursor-pointer transition duration-150 ${
                      isSelected
                        ? 'bg-amber-500/10 border border-amber-500/40 text-amber-950'
                        : 'hover:bg-stone-50 border border-transparent text-stone-800'
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${item.visual.gradient} text-white shadow-xs`}
                    >
                      <CategoryIcon slug={item.categorySlug} className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm truncate">
                          {tCategory(item.categorySlug, item.categoryLabel)}
                        </span>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                          {t('categoryBadge')}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 truncate">
                        {item.comingSoon ? t('comingSoon') : t('modelsAvailable', { count: item.modelCount })}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-800" aria-hidden="true">
                      {t('searchJump')}
                    </span>
                  </div>
                )
              }

              return (
                <div
                  key={item.id}
                  id={`search-result-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
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
                      alt=""
                      className="h-full w-full object-cover"
                      sizes="96px"
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
                          {t('inStock')}
                        </span>
                      ) : (
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600">
                          {t('outOfStock')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-600 truncate">
                      <span className="font-medium text-amber-800">{tCategory(item.categorySlug, item.categoryLabel)}</span>
                      {item.specs?.[0] && (
                        <>
                          <span aria-hidden="true">•</span>
                          <span className="truncate">{item.specs[0]}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-800" aria-hidden="true">
                    {t('viewSpecs')}
                  </span>
                </div>
              )
            })
          )}
        </div>

        {/* Keyboard Shortcuts Helper Footer */}
        <div className="flex flex-wrap items-center justify-between border-t border-stone-200/80 bg-stone-50/70 px-4 py-2.5 sm:px-6 text-[11px] text-stone-600" aria-hidden="true">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-stone-300 bg-white px-1 py-0.5 font-mono text-[10px]">↑</kbd>
              <kbd className="rounded border border-stone-300 bg-white px-1 py-0.5 font-mono text-[10px]">↓</kbd> {t('kbdNavigate')}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[10px]">↵</kbd> {t('kbdSelect')}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-stone-300 bg-white px-1 py-0.5 font-mono text-[10px]">esc</kbd> {t('kbdClose')}
            </span>
          </div>
          <span className="hidden sm:inline font-medium text-stone-600">
            {t('searchFooter', { name: shop.name })}
          </span>
        </div>
      </div>
    </div>
  )
}
