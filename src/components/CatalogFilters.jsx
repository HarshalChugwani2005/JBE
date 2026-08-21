import { useLanguage } from '../context/useLanguage'

export default function CatalogFilters({
  title,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  brands = [],
  selectedBrand = '',
  onBrandChange,
  inStockOnly = false,
  onInStockChange,
  resultsLabel,
  clearLabel,
  onClear,
}) {
  const { t } = useLanguage()
  const hasActiveFilters = Boolean(searchValue?.trim() || selectedBrand || inStockOnly)

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <label className="block flex-1">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 flex items-center gap-1.5 mb-1.5">
            <span>🔍</span>
            <span>{title || 'Search & Filter'}</span>
          </span>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder || t('searchPlaceholder')}
            className="glass-input w-full rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500 lg:flex-col lg:items-end">
          {resultsLabel && <p className="text-xs font-semibold text-stone-500">{resultsLabel}</p>}
          <div className="flex items-center gap-2">
            {onInStockChange && (
              <button
                type="button"
                onClick={() => onInStockChange(!inStockOnly)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition duration-200 cursor-pointer ${
                  inStockOnly
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300 hover:bg-stone-100'
                }`}
              >
                {inStockOnly ? '✓ ' : ''}{t('inStockOnly')}
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

      {brands.length > 0 && (
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onBrandChange?.('')}
            className={`rounded-full border px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition duration-200 cursor-pointer ${
              selectedBrand
                ? 'border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:text-amber-900'
                : 'border-amber-500 bg-amber-500 text-white shadow-xs'
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
                className={`rounded-full border px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition duration-200 cursor-pointer ${
                  isActive
                    ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
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