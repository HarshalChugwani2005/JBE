import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import ProductDetailModal from '../components/ProductDetailModal'
import SEO from '../components/SEO'
import { getCategoryBySlug, getModelBySlug } from '../data/products'

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export default function CategoryPage() {
  const { category: categorySlug, model: modelSlug } = useParams()
  const navigate = useNavigate()
  const category = getCategoryBySlug(categorySlug)

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
          <Link to={`/catalog/${categorySlug}`} className="text-sm text-blue-700 hover:underline">
            ← {category.categoryLabel}
          </Link>
          <p className="max-w-2xl text-sm text-stone-600">
            Product details open in a modal so the catalog URL stays shareable and easy to return from.
          </p>
        </div>
        <ProductDetailModal
          isOpen
          onClose={() => navigate(`/catalog/${categorySlug}`)}
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
        <Link to="/catalog" className="text-sm text-blue-700 hover:underline">
          ← Catalog
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{category.categoryLabel}</h1>

        {category.brands.map((brand) => (
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
                  modelName={model.modelName}
                  brand={brand.brand}
                  image={model.image}
                  category={categorySlug}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
