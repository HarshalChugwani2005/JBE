import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ProductImage from './ProductImage'

export default function ProductCard({
  to,
  search = '',
  modelName,
  brand,
  image,
  category,
  categoryLabel,
  inStock = true,
}) {
  const { addToCart, openCart } = useCart()

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      categorySlug: category,
      categoryLabel,
      brand,
      modelName,
      image,
    })
    openCart()
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md">
      <Link
        to={{ pathname: to, search }}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        aria-label={`${brand ? `${brand} ` : ''}${modelName}`}
      >
        <div className="relative">
          <ProductImage
            category={category}
            product={{ image }}
            alt={`${brand ? `${brand} ` : ''}${modelName}`}
            className="aspect-[4/3] w-full"
            imgClassName="group-hover:scale-105 transition duration-300"
            fallbackLabel="Photo coming soon"
          />
          {/* Stock Badge */}
          <div className="absolute top-2.5 right-2.5">
            {inStock ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs backdrop-blur-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                In Stock
              </span>
            ) : inStock === false ? (
              <span className="inline-flex items-center rounded-full bg-stone-700/80 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
                Out of Stock
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-amber-600/90 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
                Ask Availability
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 pb-2">
          <h4 className="text-base font-semibold text-stone-900 transition group-hover:text-amber-800">
            {modelName}
          </h4>
          {brand && <p className="mt-0.5 text-xs font-medium text-stone-500">{brand}</p>}
        </div>
      </Link>

      {/* Action Footer */}
      <div className="mt-auto px-4 pb-4 pt-1 flex items-center justify-between gap-2 border-t border-stone-100/80">
        <Link
          to={{ pathname: to, search }}
          className="text-xs font-semibold text-amber-700 hover:text-amber-900 hover:underline"
        >
          View Specs →
        </Link>
        <button
          type="button"
          onClick={handleQuickAdd}
          className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-700 hover:border-amber-400 hover:bg-amber-50 hover:text-stone-900 transition cursor-pointer"
          title="Add to multi-item enquiry list"
        >
          <span>+ Add to List</span>
        </button>
      </div>
    </article>
  )
}
