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
}) {
  const { t } = useLanguage()
  const hasActiveFilters = Boolean(searchValue?.trim() || selectedBrand || selectedTier || inStockOnly)

  return (
    <div className="store-card rounded-2xl p-4 sm:p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <label className="block flex-1">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 flex items-center gap-1.5 mb-1.5">
            <SearchIcon className="h-4 w-4 text-stone-500" />
            <span>{title || 'Search & Filter'}</span>
          </span>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder || t('searchPlaceholder')}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500 lg:flex-col lg:items-end">
          {resultsLabel && <p className="text-xs font-semibold text-stone-500">{resultsLabel}</p>}
          <div className="flex items-center gap-2">
            {onInStockChange && (
              <button
                type="button"
                onClick={() => onInStockChange(!inStockOnly)}
                className={`inline-flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-xs font-bold transition duration-200 cursor-pointer ${
                  inStockOnly
                    ? 'border-emerald-500 bg-emerald-600 text-white shadow-xs'
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
                className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-600 transition duration-200 hover:border-amber-400 hover:text-amber-900 hover:bg-amber-50/50 cursor-pointer"
              >
                {clearLabel || t('clearAll')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Price Segment / Tier Filter Chips */}
      {onTierChange && (
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mr-1">
            {t('priceSegment')}:
          </span>
          <button
            type="button"
            onClick={() => onTierChange('')}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition duration-200 cursor-pointer ${
              !selectedTier
                ? 'border-amber-600 bg-amber-600 text-white shadow-xs'
                : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:text-amber-900'
            }`}
          >
            {t('allTiers')}
          </button>
          <button
            type="button"
            onClick={() => onTierChange(selectedTier === 'budget' ? '' : 'budget')}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition duration-200 cursor-pointer ${
              selectedTier === 'budget'
                ? 'border-amber-600 bg-amber-600 text-white shadow-xs'
                : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:text-amber-900'
            }`}
          >
            {t('tierBudget')}
          </button>
          <button
            type="button"
            onClick={() => onTierChange(selectedTier === 'mid' ? '' : 'mid')}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition duration-200 cursor-pointer ${
              selectedTier === 'mid'
                ? 'border-amber-600 bg-amber-600 text-white shadow-xs'
                : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:text-amber-900'
            }`}
          >
            {t('tierMid')}
          </button>
          <button
            type="button"
            onClick={() => onTierChange(selectedTier === 'premium' ? '' : 'premium')}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition duration-200 cursor-pointer ${
              selectedTier === 'premium'
                ? 'border-amber-600 bg-amber-600 text-white shadow-xs'
                : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:text-amber-900'
            }`}
          >
            {t('tierPremium')}
          </button>
        </div>
      )}

      {brands.length > 0 && (
        <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mr-1">
            {t('allBrands')}:
          </span>
          <button
            type="button"
            onClick={() => onBrandChange?.('')}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition duration-200 cursor-pointer ${
              selectedBrand
                ? 'border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:text-amber-900'
                : 'border-amber-600 bg-amber-600 text-white shadow-xs'
            }`}
          >
            {t('allBrands')}
          </button>
          {brands.map((brand) => {
            const isActive = selectedBrand === brand

            return (
              <button
                key={brand}
                type="button"
                onClick={() => onBrandChange?.(isActive ? '' : brand)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition duration-200 cursor-pointer ${
                  isActive
                    ? 'border-amber-600 bg-amber-600 text-white shadow-xs'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:text-amber-900 hover:bg-amber-50/30'
                }`}
              >
                {brand}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}