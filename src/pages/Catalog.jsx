import { useMemo } from 'react'
import CategoryCard from '../components/CategoryCard'
import CatalogFilters from '../components/CatalogFilters'
import FilterEmptyState from '../components/FilterEmptyState'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import SEO from '../components/SEO'
import { useLanguage } from '../context/useLanguage'
import { useCatalogParams } from '../hooks/useCatalogParams'
import { categories } from '../data/products'
import { filterCatalog } from '../utils/catalogFilters'

const liveCount = categories.filter((c) => !c.comingSoon).length

const allBrands = Array.from(
  new Set(categories.flatMap((category) => (category.brands ?? []).map((entry) => entry.brand).filter(Boolean))),
).sort()

export default function Catalog() {
  const { t, tCategory, lang } = useLanguage()
  const { query, brand, tier, sort, search, updateParams, clearFilters } = useCatalogParams()

  const filteredCategories = useMemo(
    () =>
      filterCatalog(
        categories,
        { query, brand, tier, sort },
        { labelOf: (category) => tCategory(category.category, category.categoryLabel), locale: lang },
      ),
    [brand, query, sort, tier, tCategory, lang],
  )

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
