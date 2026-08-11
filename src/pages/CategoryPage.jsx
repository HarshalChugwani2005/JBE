import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import SEO from '../components/SEO'
import { getCategoryBySlug, getModelBySlug } from '../data/products'
import { getWhatsAppUrl, getPhoneUrl, shop } from '../data/site'

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export default function CategoryPage() {
  const { category: categorySlug, model: modelSlug } = useParams()
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
    const [selectedColor, setSelectedColor] = useState(
      model.colors && model.colors.length > 0 ? model.colors[0] : null
    )

    const whatsappText = `Hi, I would like to enquire about the ${brand.brand} ${model.modelName}`
    return (
      <>
        <SEO title={model.modelName} description={`Explore ${brand.brand} ${model.modelName} at Jai Baba Electronic.`} />
        <div>
          <Link
          to={`/catalog/${categorySlug}`}
          className="text-sm text-blue-700 hover:underline"
        >
          ← {category.categoryLabel}
        </Link>

        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-gray-100 p-6">
              <div className="flex h-64 items-center justify-center rounded bg-white text-sm text-gray-400">
                {model.image ? `${categorySlug}/${model.image}` : 'No image available'}
              </div>
              <div className="mt-4">
                <h1 className="text-2xl font-bold text-gray-900">{model.modelName}</h1>
                <p className="text-sm text-gray-500">{brand.brand}</p>
                {brand.tagline && <p className="mt-2 text-sm text-gray-600">{brand.tagline}</p>}
                {brand.warranty && (
                  <div className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    {brand.warranty}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Specifications</h3>
                {model.specs && model.specs.length > 0 ? (
                  <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
                    {model.specs.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">No specifications available for this model.</p>
                )}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700">Available Colors</h3>
                {model.colors && model.colors.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {model.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm ${
                          selectedColor === color ? 'border-amber-600 bg-amber-50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <span className="h-3 w-3 rounded-full bg-stone-300" aria-hidden />
                        {color}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">No color variants listed.</p>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={getWhatsAppUrl(whatsappText)}
                  className="inline-flex items-center justify-center rounded-lg bg-[#25D366] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1fb855]"
                >
                  WhatsApp Seller
                </a>

                <a
                  href={getPhoneUrl()}
                  className="inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white px-5 py-2 text-sm font-semibold text-stone-900 hover:bg-stone-50"
                >
                  Call Seller
                </a>

                <button
                  type="button"
                  onClick={() => (window.location.href = `/contact?enquiry=${encodeURIComponent(`${brand.brand} ${model.modelName}`)}`)}
                  className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                >
                  Enquire via form
                </button>
              </div>

              <p className="mt-4 text-sm text-gray-500">Contact: {shop.phone}</p>
            </div>
          </div>
        </div>
        </div>
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
    </>
  )
}
