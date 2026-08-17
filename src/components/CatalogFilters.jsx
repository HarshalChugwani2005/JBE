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
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <label className="block flex-1">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            {title || 'Search & Filter'}
          </span>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder || t('searchPlaceholder')}
            className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500 lg:flex-col lg:items-end">
          {resultsLabel && <p className="text-xs text-stone-500">{resultsLabel}</p>}
          <div className="flex items-center gap-2">
            {onInStockChange && (
              <button
                type="button"
                onClick={() => onInStockChange(!inStockOnly)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                  inStockOnly
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300'
                }`}
              >
                {inStockOnly ? '✓ ' : ''}{t('inStockOnly')}
              </button>
            )}
            {hasActiveFilters && onClear && (
              <button
                type="button"
                onClick={onClear}
                className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700 transition hover:border-amber-300 hover:text-amber-800 cursor-pointer"
              >
                {clearLabel || t('clearAll')}
              </button>
            )}
          </div>
        </div>
      </div>

      {brands.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onBrandChange?.('')}
            className={`rounded-full border px-3 py-1.5 text-xs sm:text-sm font-medium transition cursor-pointer ${
              selectedBrand
                ? 'border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:text-amber-800'
                : 'border-amber-500 bg-amber-50 text-amber-900'
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
                className={`rounded-full border px-3 py-1.5 text-xs sm:text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:text-amber-800'
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