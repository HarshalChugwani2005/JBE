import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import CatalogFilters from '../components/CatalogFilters'
import Section from '../components/Section'
import SEO from '../components/SEO'
import { useLanguage } from '../context/useLanguage'
import { useCatalogParams } from '../hooks/useCatalogParams'
import { categories } from '../data/products'

export default function Catalog() {
  const { t } = useLanguage()
  const { query, brand, tier, sort, inStockOnly, updateParams, clearFilters } = useCatalogParams()
  const { search } = useLocation()

  const liveCount = categories.filter((c) => !c.comingSoon).length

  const allBrands = useMemo(() => {
    const brandNames = new Set()
    categories.forEach((category) => {
      category.brands?.forEach((entry) => {
        if (entry.brand) brandNames.add(entry.brand)
      })
    })
    return Array.from(brandNames).sort()
  }, [])

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const normalizedBrand = brand.trim().toLowerCase()

    return [...categories].filter((category) => {
      const categoryMatchesBrand =
        !normalizedBrand || category.brands?.some((entry) => entry.brand?.toLowerCase() === normalizedBrand)

      if (!categoryMatchesBrand) return false

      if (inStockOnly) {
        const hasInStockModel = category.brands?.some((b) =>
          b.models?.some((m) => m.inStock !== false)
        )
        if (!hasInStockModel) return false
      }

      if (tier) {
        const hasTierModel = category.brands?.some((b) =>
          b.models?.some((m) => m.priceTier === tier)
        )
        if (!hasTierModel) return false
      }

      if (!normalizedQuery) return true

      const searchableText = [
        category.categoryLabel,
        category.category,
        ...(category.brands ?? []).flatMap((entry) => [
          entry.brand,
          entry.tagline,
          entry.warranty,
          ...(entry.models ?? []).flatMap((model) => [model.modelName, ...(model.specs ?? []), ...(model.colors ?? [])]),
        ]),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const queryWords = normalizedQuery.split(/\s+/).filter(Boolean)
      return queryWords.every((word) => searchableText.includes(word))
    }).sort((left, right) => {
      if (sort === 'name') return left.categoryLabel.localeCompare(right.categoryLabel)
      if (sort === 'stock') {
        const leftStock = left.brands?.some((entry) => entry.models?.some((model) => model.inStock !== false))
        const rightStock = right.brands?.some((entry) => entry.models?.some((model) => model.inStock !== false))
        return Number(rightStock) - Number(leftStock)
      }
      return 0
    })
  }, [brand, inStockOnly, query, sort, tier])

  return (
    <>
      <SEO
        title={t('catalogTitle')}
        description="Browse Jai Baba Electronic's catalog by category, including ceiling fans and more products available for enquiry."
      />
      <div>
        <header className="border-b border-stone-200/80 pb-8">
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl md:text-4xl">
            {t('catalogTitle')}
          </h1>
          <p className="mt-2.5 max-w-2xl text-stone-600 text-sm sm:text-base">
            {t('catalogSubtitle')} <span className="font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full">{liveCount} {t('allCategories').toLowerCase()}</span> available.
          </p>
        </header>

        <div className="mt-8">
          <CatalogFilters
            searchValue={query}
            onSearchChange={(value) => updateParams({ q: value })}
            searchPlaceholder={t('searchPlaceholder')}
            brands={allBrands}
            selectedBrand={brand}
            onBrandChange={(value) => updateParams({ brand: value })}
            selectedTier={tier}
            onTierChange={(value) => updateParams({ tier: value })}
            inStockOnly={inStockOnly}
            onInStockChange={(value) => updateParams({ inStock: value })}
            sortValue={sort}
            onSortChange={(value) => updateParams({ sort: value })}
            resultsLabel={`${filteredCategories.length} of ${categories.length} shown`}
            onClear={clearFilters}
          />
        </div>

        <Section
          title={t('allCategories')}
          subtitle="Tap any category to view brands and models. Categories marked Coming Soon will be updated as product data arrives."
          className="pt-8"
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {filteredCategories.map((cat) => (
              <CategoryCard
                key={cat.category}
                category={cat.category}
                categoryLabel={cat.categoryLabel}
                comingSoon={cat.comingSoon}
                brands={cat.brands}
                search={search}
              />
            ))}
          </div>
          {filteredCategories.length === 0 && (
            <p className="mt-4 rounded-2xl border border-stone-200 bg-white px-5 py-4 text-sm font-medium text-stone-600 shadow-xs">
              {t('noCategoriesFound')}
            </p>
          )}
        </Section>

        <div className="mt-8 rounded-2xl border border-amber-300/80 bg-amber-50/80 px-5 py-4 text-xs sm:text-sm text-amber-900 shadow-xs">
          <strong>{t('contactForPrice')}</strong> — {t('contactNotice')}
        </div>
      </div>
    </>
  )
}
