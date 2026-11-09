import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import CatalogFilters from '../components/CatalogFilters'
import FilterEmptyState from '../components/FilterEmptyState'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import SEO from '../components/SEO'
import { useLanguage } from '../context/useLanguage'
import { useCatalogParams } from '../hooks/useCatalogParams'
import { categories } from '../data/products'

const liveCount = categories.filter((c) => !c.comingSoon).length

const allBrands = Array.from(
  new Set(categories.flatMap((category) => (category.brands ?? []).map((entry) => entry.brand).filter(Boolean))),
).sort()

export default function Catalog() {
  const { t, tCategory, lang } = useLanguage()
  const { query, brand, tier, sort, inStockOnly, updateParams, clearFilters } = useCatalogParams()
  const { search } = useLocation()

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const normalizedBrand = brand.trim().toLowerCase()
    const labelOf = (category) => tCategory(category.category, category.categoryLabel)

    return categories.filter((category) => {
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
        labelOf(category),
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
      if (sort === 'name') return labelOf(left).localeCompare(labelOf(right), lang)
      if (sort === 'stock') {
        const leftStock = left.brands?.some((entry) => entry.models?.some((model) => model.inStock !== false))
        const rightStock = right.brands?.some((entry) => entry.models?.some((model) => model.inStock !== false))
        return Number(rightStock) - Number(leftStock)
      }
      return 0
    })
  }, [brand, inStockOnly, query, sort, tier, tCategory, lang])

  return (
    <>
      <SEO title={t('catalogTitle')} description={t('seoCatalogDescription')} />
      <div>
        <PageHeader title={t('catalogTitle')} subtitle={t('catalogSubtitle')}>
          <p className="mt-3">
            <span className="rounded-full bg-amber-100/80 px-2.5 py-0.5 text-xs font-bold text-amber-900">
              {t('allCategories')}: {liveCount}
            </span>
          </p>
        </PageHeader>

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
            resultsLabel={t('categoriesShown', { shown: filteredCategories.length, total: categories.length })}
            onClear={clearFilters}
          />
        </div>

        <Section title={t('allCategories')} subtitle={t('catalogSectionSubtitle')} className="pt-8">
          {filteredCategories.length > 0 ? (
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
          ) : (
            <FilterEmptyState description={t('noCategoriesFound')} onClear={clearFilters} />
          )}
        </Section>

        <div className="mt-8 rounded-2xl border border-amber-300/80 bg-amber-50/80 px-5 py-4 text-xs sm:text-sm text-amber-900 shadow-xs">
          <strong>{t('contactForPrice')}</strong> — {t('contactNotice')}
        </div>
      </div>
    </>
  )
}
