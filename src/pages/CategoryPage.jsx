import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
import Breadcrumbs from '../components/Breadcrumbs'
import CatalogFilters from '../components/CatalogFilters'
import EmptyState from '../components/EmptyState'
import FilterEmptyState from '../components/FilterEmptyState'
import PageHeader from '../components/PageHeader'
import ProductCard from '../components/ProductCard'
import ProductDetailModal from '../components/ProductDetailModal'
import RecentlyViewed from '../components/RecentlyViewed'
import SEO from '../components/SEO'
import { ArrowLeftIcon, PackageIcon, SearchIcon, WhatsAppIcon } from '../components/Icons'
import { useLanguage } from '../context/useLanguage'
import { useCatalogParams } from '../hooks/useCatalogParams'
import { getModelCount } from '../data/categoryVisuals'
import { getProductImageUrls } from '../data/productImages'
import { getCategoryBySlug, getModelBySlug } from '../data/products'
import { getWhatsAppUrl, shop } from '../data/site'
import { buildGreeting } from '../i18n/whatsappMessages'
import { buildBreadcrumbJsonLd, buildCategorySeo, buildModelSeo, buildProductJsonLd } from '../i18n/seo'
import { trackWhatsAppClick } from '../utils/analytics'
import { filterCategoryBrands } from '../utils/catalogFilters'
import { slugify } from '../utils/slugify'

function absoluteUrl(path) {
  if (!path) return undefined
  return path.startsWith('http') ? path : `${shop.siteUrl}${path}`
}

export default function CategoryPage() {
  const { category: categorySlug, model: modelSlug } = useParams()
  const navigate = useNavigate()
  const { query, brand, tier, sort, search, updateParams, clearFilters } = useCatalogParams()
  const { t, tCategory, tProduct, lang, href } = useLanguage()

  const category = getCategoryBySlug(categorySlug)

  const allBrands = useMemo(() => {
    const brandNames = new Set(category?.brands?.map((entry) => entry.brand).filter(Boolean) ?? [])
    return Array.from(brandNames).sort()
  }, [category])

  const filteredBrands = useMemo(
    () => (category ? filterCategoryBrands(category, { query, brand, tier, sort }) : []),
    [brand, category, query, sort, tier],
  )

  // Stable callback so the modal's focus/scroll-lock effect does not re-run on every render.
  const closeModal = useCallback(
    () => navigate(`${href(`/catalog/${categorySlug}`)}${search}`),
    [navigate, categorySlug, search, href],
  )

  const catalogCrumb = { label: t('navCatalog'), to: `${href('/catalog')}${search}` }
  const homeCrumb = { label: t('navHome'), to: href('/') }

  if (!category) {
    return (
      <>
        <SEO title={t('categoryNotFound')} description={t('seoNotFoundDescription')} noindex />
        <Breadcrumbs items={[homeCrumb, catalogCrumb, { label: t('categoryNotFound') }]} />
        <EmptyState as="h1" icon={SearchIcon} title={t('categoryNotFound')} description={t('categoryNotFoundText')}>
          <Link to={href('/catalog')} className="btn btn-primary">
            <ArrowLeftIcon className="h-4 w-4" />
            <span>{t('backToCatalog')}</span>
          </Link>
          <StatusWhatsAppLink source="category_not_found" />
        </EmptyState>
      </>
    )
  }

  const label = tCategory(category.category, category.categoryLabel)
  const breadcrumbItems = [homeCrumb, catalogCrumb, { label }]

  if (category.comingSoon) {
    const meta = buildCategorySeo(lang, category)
    return (
      <>
        <SEO title={meta.title} description={meta.description} image={meta.image} />
        <Breadcrumbs items={breadcrumbItems} />
        <EmptyState as="h1" icon={PackageIcon} title={label} description={t('comingSoonNotice')}>
          <Link to={href('/catalog')} className="btn btn-secondary">
            <ArrowLeftIcon className="h-4 w-4" />
            <span>{t('backToCatalog')}</span>
          </Link>
          <StatusWhatsAppLink source="category_coming_soon" />
        </EmptyState>
      </>
    )
  }

  const activeModalModel = modelSlug ? getModelBySlug(categorySlug, modelSlug) : null
  const activeBrandName = activeModalModel?.brand?.brand || ''

  const meta = activeModalModel
    ? buildModelSeo(lang, category, activeBrandName, activeModalModel.model)
    : buildCategorySeo(lang, category)

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(shop.siteUrl, [
    { name: t('navHome'), path: href('/') },
    { name: t('navCatalog'), path: href('/catalog') },
    { name: label, path: href(`/catalog/${category.category}`) },
  ])
  const jsonLd = activeModalModel
    ? [
        breadcrumbJsonLd,
        buildProductJsonLd(shop.siteUrl, {
          lang,
          category,
          brandName: activeBrandName,
          model: activeModalModel.model,
          imageUrl: absoluteUrl(getProductImageUrls(category.category, activeModalModel.model)[0]),
        }),
      ]
    : breadcrumbJsonLd

  return (
    <>
      <SEO title={meta.title} description={meta.description} image={meta.image} jsonLd={jsonLd} />
      <div>
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />
        <PageHeader title={label} subtitle={t('modelsAvailable', { count: getModelCount(category) })} />

        <div className="mt-6">
          <CatalogFilters
            searchValue={query}
            onSearchChange={(value) => updateParams({ q: value })}
            searchPlaceholder={t('searchWithinCategory')}
            brands={allBrands}
            selectedBrand={brand}
            onBrandChange={(value) => updateParams({ brand: value })}
            selectedTier={tier}
            onTierChange={(value) => updateParams({ tier: value })}
            sortValue={sort}
            onSortChange={(value) => updateParams({ sort: value })}
            resultsLabel={t('brandsShown', { shown: filteredBrands.length, total: category.brands.length })}
            onClear={clearFilters}
          />
        </div>

        {filteredBrands.map((brandEntry) => (
          <section key={brandEntry.brand} className="mt-10">
            <div className="flex flex-wrap items-center gap-3 border-b border-stone-200/80 pb-3">
              <h2 className="font-heading text-2xl font-extrabold text-stone-900">{brandEntry.brand}</h2>
              {brandEntry.tagline && (
                <span className="text-xs font-medium text-stone-600">{tProduct(brandEntry.tagline)}</span>
              )}
              {brandEntry.warranty && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200/80 shadow-xs">
                  {tProduct(brandEntry.warranty)}
                </span>
              )}
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {brandEntry.models.map((model) => (
                <div key={model.modelName} className="stagger-item">
                  <ProductCard
                    to={href(`/catalog/${categorySlug}/${slugify(model.modelName)}`)}
                    search={search}
                    modelName={model.modelName}
                    brand={brandEntry.brand}
                    image={model.image}
                    category={categorySlug}
                    categoryLabel={category.categoryLabel}
                    specs={model.specs}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}

        {filteredBrands.length === 0 && (
          <div className="mt-8">
            <FilterEmptyState description={t('noBrandsFound')} onClear={clearFilters} />
          </div>
        )}

        {/* Modal if URL contains model slug */}
        {activeModalModel && (
          <ProductDetailModal
            isOpen
            onClose={closeModal}
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

function StatusWhatsAppLink({ source }) {
  const { t, lang } = useLanguage()
  return (
    <a
      href={getWhatsAppUrl(buildGreeting(lang))}
      onClick={() => trackWhatsAppClick(source)}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-whatsapp"
    >
      <WhatsAppIcon className="h-4 w-4" />
      <span>{t('askUsOnWhatsApp')}</span>
    </a>
  )
}
