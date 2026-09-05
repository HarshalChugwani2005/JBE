import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import CatalogFilters from '../components/CatalogFilters'
import ProductDetailModal from '../components/ProductDetailModal'
import RecentlyViewed from '../components/RecentlyViewed'
import SEO from '../components/SEO'
import { useLanguage } from '../context/useLanguage'
import { getCategoryBySlug, getModelBySlug } from '../data/products'
import { getProductImageUrls } from '../data/productImages'

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export default function CategoryPage() {
  const { category: categorySlug, model: modelSlug } = useParams()
  const navigate = useNavigate()
  const { search } = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useLanguage()

  const category = getCategoryBySlug(categorySlug)
  const query = searchParams.get('q') ?? ''
  const brand = searchParams.get('brand') ?? ''
  const tier = searchParams.get('tier') ?? ''
  const inStockOnly = searchParams.get('inStock') === '1'

  const allBrands = useMemo(() => {
    const brandNames = new Set(category?.brands?.map((entry) => entry.brand).filter(Boolean) ?? [])
    return Array.from(brandNames).sort()
  }, [category])

  const filteredBrands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const normalizedBrand = brand.trim().toLowerCase()

    return (category?.brands ?? []).map((entry) => {
      const brandMatches = !normalizedBrand || entry.brand?.toLowerCase() === normalizedBrand
      if (!brandMatches) return null

      let models = entry.models ?? []
      if (inStockOnly) {
        models = models.filter((m) => m.inStock !== false)
      }
      if (tier) {
        models = models.filter((m) => m.priceTier === tier)
      }

      if (normalizedQuery) {
        const queryWords = normalizedQuery.split(/\s+/).filter(Boolean)
        models = models.filter((model) => {
          const searchableText = [
            entry.brand,
            entry.tagline,
            entry.warranty,
            model.modelName,
            ...(model.specs ?? []),
            ...(model.colors ?? []),
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

          return queryWords.every((word) => searchableText.includes(word))
        })
      }

      if (models.length === 0) return null

      return {
        ...entry,
        models,
      }
    }).filter(Boolean)
  }, [brand, category, inStockOnly, query, tier])

  const updateParams = (next) => {
    const params = new URLSearchParams(searchParams)
    const nextQuery = next.q !== undefined ? next.q : query
    const nextBrand = next.brand !== undefined ? next.brand : brand
    const nextTier = next.tier !== undefined ? next.tier : tier
    const nextInStock = next.inStock !== undefined ? next.inStock : inStockOnly

    if (nextQuery.trim()) params.set('q', nextQuery)
    else params.delete('q')

    if (nextBrand.trim()) params.set('brand', nextBrand)
    else params.delete('brand')

    if (nextTier.trim()) params.set('tier', nextTier)
    else params.delete('tier')

    if (nextInStock) params.set('inStock', '1')
    else params.delete('inStock')

    setSearchParams(params, { replace: true })
  }

  const clearFilters = () => setSearchParams(new URLSearchParams(), { replace: true })

  if (!category) {
    return (
      <>
        <SEO title={t('categoryNotFound')} description="The requested category could not be found." />
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold text-stone-900">{t('categoryNotFound')}</h1>
          <Link to="/catalog" className="mt-4 inline-flex items-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition">
            {t('backToCatalog')}
          </Link>
        </div>
      </>
    )
  }

  const activeModalModel = modelSlug ? getModelBySlug(categorySlug, modelSlug) : null

  if (category.comingSoon) {
    return (
      <>
        <SEO title={category.categoryLabel} description={`See upcoming products in ${category.categoryLabel} at Jai Baba Electronic.`} />
        <div>
          <Link to="/catalog" className="text-sm font-semibold text-amber-700 hover:underline">
            {t('backToCatalog')}
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-stone-900">{category.categoryLabel}</h1>
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {t('comingSoonNotice')}
          </p>
        </div>
      </>
    )
  }

  const modelImages = activeModalModel ? getProductImageUrls(categorySlug, activeModalModel.model) : []
  const activeBrandName = activeModalModel?.brand?.brand || activeModalModel?.brand || ''
  const modelName = activeModalModel?.model?.modelName || ''

  const seoTitle = activeModalModel
    ? `${activeBrandName ? `${activeBrandName} ` : ''}${modelName} | ${category.categoryLabel}`
    : `${category.categoryLabel} | Jai Baba Electronic`

  const seoDescription = activeModalModel
    ? `${activeBrandName ? `${activeBrandName} ` : ''}${modelName} (${category.categoryLabel}). ${activeModalModel.model.specs?.slice(0, 3).join(', ') || ''}. Genuine wholesale and retail pricing on enquiry at Jai Baba Electronic Malkapur.`
    : `Browse ${category.categoryLabel} products at Jai Baba Electronic Malkapur. Wholesale and retail pricing on enquiry.`

  const modelSlugClean = modelName ? slugify(modelName) : ''
  const seoImage = activeModalModel
    ? `/og/products/${categorySlug}-${modelSlugClean}.png`
    : `/og/${categorySlug}.png`

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        image={seoImage}
      />
      <div>
        <Link to={`/catalog${search}`} className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-900 transition-colors">
          <span>←</span>
          <span>{t('backToCatalog')}</span>
        </Link>
        <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          {category.categoryLabel}
        </h1>

        <div className="mt-6">
          <CatalogFilters
            searchValue={query}
            onSearchChange={(value) => updateParams({ q: value })}
            searchPlaceholder={`${t('searchWithinCategory')}`}
            brands={allBrands}
            selectedBrand={brand}
            onBrandChange={(value) => updateParams({ brand: value })}
            selectedTier={tier}
            onTierChange={(value) => updateParams({ tier: value })}
            inStockOnly={inStockOnly}
            onInStockChange={(value) => updateParams({ inStock: value })}
            resultsLabel={`${filteredBrands.length} of ${category.brands.length} brands shown`}
            onClear={clearFilters}
          />
        </div>

        {filteredBrands.map((brandEntry) => (
          <section key={brandEntry.brand} className="mt-10">
            <div className="flex flex-wrap items-center gap-3 border-b border-stone-200/80 pb-3">
              <h2 className="font-heading text-2xl font-extrabold text-stone-900">{brandEntry.brand}</h2>
              {brandEntry.tagline && (
                <span className="text-xs font-medium text-stone-500">{brandEntry.tagline}</span>
              )}
              {brandEntry.warranty && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200/80 shadow-xs">
                  {brandEntry.warranty}
                </span>
              )}
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {brandEntry.models.map((model) => (
                <ProductCard
                  key={model.modelName}
                  to={`/catalog/${categorySlug}/${slugify(model.modelName)}`}
                  search={search}
                  modelName={model.modelName}
                  brand={brandEntry.brand}
                  image={model.image}
                  category={categorySlug}
                  categoryLabel={category.categoryLabel}
                  inStock={model.inStock}
                />
              ))}
            </div>
          </section>
        ))}

        {filteredBrands.length === 0 && (
          <p className="mt-6 rounded-2xl border border-stone-200 bg-white px-5 py-4 text-sm font-medium text-stone-600 shadow-xs">
            {t('noBrandsFound')}
          </p>
        )}

        {/* Modal if URL contains model slug */}
        {activeModalModel && (
          <ProductDetailModal
            isOpen
            onClose={() => navigate(`/catalog/${categorySlug}${search}`)}
            product={{
              categorySlug,
              categoryLabel: category.categoryLabel,
              brand: activeModalModel.brand,
              model: activeModalModel.model,
            }}
          />
        )}

        {/* Recently Viewed Products */}
        <RecentlyViewed currentModelName={activeModalModel?.model?.modelName} />
      </div>
    </>
  )
}
