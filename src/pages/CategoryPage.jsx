import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import CatalogFilters from '../components/CatalogFilters'
import ProductDetailModal from '../components/ProductDetailModal'
import SEO from '../components/SEO'
import { getCategoryBySlug, getModelBySlug } from '../data/products'

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export default function CategoryPage() {
  const { category: categorySlug, model: modelSlug } = useParams()
  const navigate = useNavigate()
  const { search } = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const category = getCategoryBySlug(categorySlug)
  const query = searchParams.get('q') ?? ''
  const brand = searchParams.get('brand') ?? ''

  const allBrands = useMemo(() => {
    const brandNames = new Set(category?.brands?.map((entry) => entry.brand).filter(Boolean) ?? [])
    return Array.from(brandNames).sort()
  }, [category])

  const filteredBrands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const normalizedBrand = brand.trim().toLowerCase()

    return (category?.brands ?? []).filter((entry) => {
      const brandMatches = !normalizedBrand || entry.brand?.toLowerCase() === normalizedBrand
      if (!brandMatches) return false

      if (!normalizedQuery) return true

      const searchableText = [
        entry.brand,
        entry.tagline,
        entry.warranty,
        ...(entry.models ?? []).flatMap((model) => [model.modelName, ...(model.specs ?? []), ...(model.colors ?? [])]),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedQuery)
    })
  }, [brand, category, query])

  const updateParams = (next) => {
    const params = new URLSearchParams(searchParams)
    const nextQuery = next.q ?? query
    const nextBrand = next.brand ?? brand

    if (nextQuery.trim()) params.set('q', nextQuery)
    else params.delete('q')

    if (nextBrand.trim()) params.set('brand', nextBrand)
    else params.delete('brand')

    setSearchParams(params, { replace: true })
  }

  const clearFilters = () => setSearchParams(new URLSearchParams(), { replace: true })

  if (!category) {
    return (
      <>
        <SEO title="Category not found" description="The requested category could not be found." />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category not found</h1>
          <Link to="/catalog" className="mt-4 inline-block text-blue-700 hover:underline">
            Back to catalog
          </Link>
        </div>
      </>
    )
  }

  if (modelSlug) {
    const result = getModelBySlug(categorySlug, modelSlug)
    if (!result) {
      return (
        <>
          <SEO title="Product not found" description="The requested product could not be found." />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
            <Link
              to={`/catalog/${categorySlug}`}
              className="mt-4 inline-block text-blue-700 hover:underline"
            >
              Back to {category.categoryLabel}
            </Link>
          </div>
        </>
      )
    }

    const { brand, model } = result
    return (
      <>
        <SEO title={model.modelName} description={`Explore ${brand.brand} ${model.modelName} at Jai Baba Electronic.`} />
        <div className="space-y-4">
          <Link to={`/catalog/${categorySlug}${search}`} className="text-sm text-blue-700 hover:underline">
            ← {category.categoryLabel}
          </Link>
          <p className="max-w-2xl text-sm text-stone-600">
            Product details open in a modal so the catalog URL stays shareable and easy to return from.
          </p>
        </div>
        <ProductDetailModal
          isOpen
          onClose={() => navigate(`/catalog/${categorySlug}${search}`)}
          product={{
            categorySlug,
            categoryLabel: category.categoryLabel,
            brand,
            model,
          }}
        />
      </>
    )
  }

  if (category.comingSoon) {
    return (
      <>
        <SEO title={category.categoryLabel} description={`See upcoming products in ${category.categoryLabel} at Jai Baba Electronic.`} />
        <div>
        <Link to="/catalog" className="text-sm text-blue-700 hover:underline">
          ← Catalog
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{category.categoryLabel}</h1>
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-amber-800">
          This category is coming soon. Check back later or contact us for availability.
        </p>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO title={category.categoryLabel} description={`Browse ${category.categoryLabel} products at Jai Baba Electronic.`} />
      <div>
        <Link to={`/catalog${search}`} className="text-sm text-blue-700 hover:underline">
          ← Catalog
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{category.categoryLabel}</h1>

        <div className="mt-8">
          <CatalogFilters
            searchValue={query}
            onSearchChange={(value) => updateParams({ q: value })}
            searchPlaceholder={`Search within ${category.categoryLabel}`}
            brands={allBrands}
            selectedBrand={brand}
            onBrandChange={(value) => updateParams({ brand: value })}
            resultsLabel={`${filteredBrands.length} of ${category.brands.length} brands shown`}
            onClear={clearFilters}
          />
        </div>

        {filteredBrands.map((brand) => (
          <section key={brand.brand} className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">{brand.brand}</h2>
              {brand.tagline && (
                <span className="text-sm text-gray-500">{brand.tagline}</span>
              )}
              {brand.warranty && (
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  {brand.warranty}
                </span>
              )}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {brand.models.map((model) => (
                <ProductCard
                  key={model.modelName}
                  to={`/catalog/${categorySlug}/${slugify(model.modelName)}`}
                  search={search}
                  modelName={model.modelName}
                  brand={brand.brand}
                  image={model.image}
                  category={categorySlug}
                />
              ))}
            </div>
          </section>
        ))}

        {filteredBrands.length === 0 && (
          <p className="mt-4 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600">
            No brands match your current search or brand filter.
          </p>
        )}
      </div>
    </>
  )
}
