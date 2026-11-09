import { useState } from 'react'
import { useLanguage } from '../context/useLanguage'
import { CheckIcon, SearchIcon } from './Icons'

export default function CatalogFilters({
  title,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  brands = [],
  selectedBrand = '',
  onBrandChange,
  selectedTier = '',
  onTierChange,
  inStockOnly = false,
  onInStockChange,
  resultsLabel,
  clearLabel,
  onClear,
  sortValue = '',
  onSortChange,
}) {
  const { t } = useLanguage()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const hasActiveFilters = Boolean(searchValue?.trim() || selectedBrand || selectedTier || inStockOnly)
  const tierLabels = { budget: t('tierBudget'), mid: t('tierMid'), premium: t('tierPremium') }
  const chipClass = (active) =>
    `min-h-8 rounded-full border px-3 py-1 text-xs font-semibold transition duration-200 cursor-pointer ${
      active
        ? 'border-amber-700 bg-amber-700 text-white shadow-xs'
        : 'border-stone-200 bg-white text-stone-700 hover:border-amber-300 hover:text-amber-900 hover:bg-amber-50/30'
    }`
  const removableChip = (label, onRemove, tone = 'amber') => (
    <button
      type="button"
      onClick={onRemove}
      aria-label={t('removeFilter', { label })}
      className={`inline-flex min-h-8 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        tone === 'emerald'
          ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
      }`}
    >
      <span>{label}</span>
      <span aria-hidden="true">×</span>
    </button>
  )

  return (
    <div className="store-card rounded-2xl p-4 sm:p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <label className="block flex-1">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-600 flex items-center gap-1.5 mb-1.5">
            <SearchIcon className="h-4 w-4 text-stone-600" />
            <span>{title || t('searchAndFilter')}</span>
          </span>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder || t('searchPlaceholder')}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3 text-sm text-stone-600 lg:flex-col lg:items-end">
          <div className="flex w-full items-center justify-between gap-2 lg:w-auto lg:justify-end">
            {resultsLabel && <p className="text-xs font-semibold text-stone-600" aria-live="polite">{resultsLabel}</p>}
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              aria-controls="catalog-filter-options"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-bold text-stone-700 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 lg:hidden"
            >
              <span>{t('filters')}</span>
              <span aria-hidden="true">{filtersOpen ? '−' : '+'}</span>
              {hasActiveFilters && <span className="h-1.5 w-1.5 rounded-full bg-amber-600" aria-hidden="true" />}
            </button>
          </div>
          <div id="catalog-filter-options" className={`${filtersOpen ? 'flex' : 'hidden'} w-full items-center gap-2 lg:flex lg:w-auto`}>
            {onInStockChange && (
              <button
                type="button"
                onClick={() => onInStockChange(!inStockOnly)}
                aria-pressed={inStockOnly}
                className={`inline-flex min-h-8 items-center gap-1 rounded-full border px-3.5 py-1.5 text-xs font-bold transition duration-200 cursor-pointer ${
                  inStockOnly
                    ? 'border-emerald-700 bg-emerald-700 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300 hover:bg-stone-100'
                }`}
              >
                {inStockOnly && <CheckIcon className="h-3 w-3" />}
                <span>{t('inStockOnly')}</span>
              </button>
            )}
            {hasActiveFilters && onClear && (
              <button
                type="button"
                onClick={onClear}
                className="min-h-8 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 transition duration-200 hover:border-amber-400 hover:text-amber-900 hover:bg-amber-50/50 cursor-pointer"
              >
                {clearLabel || t('clearAll')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Price Segment / Tier Filter Chips */}
      {onTierChange && (
        <div className={`${filtersOpen ? 'flex' : 'hidden'} mt-5 border-t border-stone-100 pt-4 flex-wrap items-center gap-2 lg:flex`}>
          <span id="catalog-tier-label" className="text-xs font-bold uppercase tracking-wider text-stone-600 mr-1">
            {t('priceSegment')}:
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby="catalog-tier-label">
            <button type="button" onClick={() => onTierChange('')} aria-pressed={!selectedTier} className={chipClass(!selectedTier)}>
              {t('allTiers')}
            </button>
            {Object.entries(tierLabels).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => onTierChange(selectedTier === value ? '' : value)}
                aria-pressed={selectedTier === value}
                className={chipClass(selectedTier === value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {brands.length > 0 && (
        <div className={`${filtersOpen ? 'flex' : 'hidden'} mt-3 border-t border-stone-100 pt-3 flex-wrap items-center gap-2 lg:flex`}>
          <span id="catalog-brand-label" className="text-xs font-bold uppercase tracking-wider text-stone-600 mr-1">
            {t('allBrands')}:
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby="catalog-brand-label">
            <button type="button" onClick={() => onBrandChange?.('')} aria-pressed={!selectedBrand} className={chipClass(!selectedBrand)}>
              {t('allBrands')}
            </button>
            {brands.map((brand) => {
              const isActive = selectedBrand === brand

              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => onBrandChange?.(isActive ? '' : brand)}
                  aria-pressed={isActive}
                  className={chipClass(isActive)}
                >
                  {brand}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {(hasActiveFilters || onSortChange) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-3">
          {hasActiveFilters && <span className="text-xs font-semibold text-stone-600">{t('activeFilters')}</span>}
          {searchValue?.trim() && removableChip(t('searchChip', { query: searchValue.trim() }), () => onSearchChange?.(''))}
          {selectedBrand && removableChip(selectedBrand, () => onBrandChange?.(''))}
          {selectedTier && removableChip(tierLabels[selectedTier] ?? selectedTier, () => onTierChange?.(''))}
          {inStockOnly && removableChip(t('inStockOnly'), () => onInStockChange?.(false), 'emerald')}
          {onSortChange && (
            <label className="ml-auto inline-flex items-center gap-2 text-xs font-semibold text-stone-600">
              <span>{t('sort')}</span>
              <select value={sortValue} onChange={(event) => onSortChange(event.target.value)} className="min-h-9 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-700 outline-none focus:border-amber-500">
                <option value="">{t('sortRecommended')}</option>
                <option value="stock">{t('sortInStock')}</option>
                <option value="name">{t('sortName')}</option>
              </select>
            </label>
          )}
        </div>
      )}
    </div>
  )
}