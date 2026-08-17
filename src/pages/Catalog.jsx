import { useMemo } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import CatalogFilters from '../components/CatalogFilters'
import Section from '../components/Section'
import SEO from '../components/SEO'
import { useLanguage } from '../context/useLanguage'
import { categories } from '../data/products'

export default function Catalog() {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const { search } = useLocation()
  const query = searchParams.get('q') ?? ''
  const brand = searchParams.get('brand') ?? ''
  const inStockOnly = searchParams.get('inStock') === '1'

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
    })
  }, [brand, inStockOnly, query])

  const updateParams = (next) => {
    const params = new URLSearchParams(searchParams)
    const nextQuery = next.q !== undefined ? next.q : query
    const nextBrand = next.brand !== undefined ? next.brand : brand
    const nextInStock = next.inStock !== undefined ? next.inStock : inStockOnly

    if (nextQuery.trim()) params.set('q', nextQuery)
    else params.delete('q')

    if (nextBrand.trim()) params.set('brand', nextBrand)
    else params.delete('brand')

    if (nextInStock) params.set('inStock', '1')
    else params.delete('inStock')

    setSearchParams(params, { replace: true })
  }

  const clearFilters = () => setSearchParams(new URLSearchParams(), { replace: true })

  return (
    <>
      <SEO
        title={t('catalogTitle')}
        description="Browse Jai Baba Electronic's catalog by category, including ceiling fans and more products available for enquiry."
      />
      <div>
        <header className="border-b border-stone-200 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
            {t('catalogTitle')}
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            {t('catalogSubtitle')} {liveCount} {t('allCategories').toLowerCase()} available.
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
            inStockOnly={inStockOnly}
            onInStockChange={(value) => updateParams({ inStock: value })}
            resultsLabel={`${filteredCategories.length} of ${categories.length} shown`}
            onClear={clearFilters}
          />
        </div>

        <Section
          title={t('allCategories')}
          subtitle="Tap any category to view brands and models. Categories marked Coming Soon will be updated as product data arrives."
          className="pt-8"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <p className="mt-4 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600">
              {t('noCategoriesFound')}
            </p>
          )}
        </Section>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <strong>{t('contactForPrice')}</strong> — {t('contactNotice')}
        </div>
      </div>
    </>
  )
}
