import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getCategoryBySlug, getModelBySlug } from '../data/products'

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export default function CategoryPage() {
  const { category: categorySlug, model: modelSlug } = useParams()
  const category = getCategoryBySlug(categorySlug)

  if (!category) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Category not found</h1>
        <Link to="/catalog" className="mt-4 inline-block text-blue-700 hover:underline">
          Back to catalog
        </Link>
      </div>
    )
  }

  if (modelSlug) {
    const result = getModelBySlug(categorySlug, modelSlug)
    if (!result) {
      return (
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <Link
            to={`/catalog/${categorySlug}`}
            className="mt-4 inline-block text-blue-700 hover:underline"
          >
            Back to {category.categoryLabel}
          </Link>
        </div>
      )
    }

    const { brand, model } = result
    return (
      <div>
        <Link
          to={`/catalog/${categorySlug}`}
          className="text-sm text-blue-700 hover:underline"
        >
          ← {category.categoryLabel}
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{model.modelName}</h1>
        <p className="text-gray-600">{brand.brand}</p>
        <p className="mt-4 text-sm text-gray-500">
          Product detail route stub — full detail view on Day 3.
        </p>
      </div>
    )
  }

  if (category.comingSoon) {
    return (
      <div>
        <Link to="/catalog" className="text-sm text-blue-700 hover:underline">
          ← Catalog
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{category.categoryLabel}</h1>
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-amber-800">
          This category is coming soon. Check back later or contact us for availability.
        </p>
      </div>
    )
  }

  return (
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
              <Link
                key={model.modelName}
                to={`/catalog/${categorySlug}/${slugify(model.modelName)}`}
              >
                <ProductCard
                  modelName={model.modelName}
                  brand={brand.brand}
                  image={model.image}
                  category={categorySlug}
                />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
