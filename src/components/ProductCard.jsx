import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'

export default function ProductCard({ to, modelName, brand, image, category }) {
  const card = (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md focus-within:border-amber-400">
      <ProductImage
        category={category}
        product={{ image }}
        alt={`${brand ? `${brand} ` : ''}${modelName}`}
        className="aspect-[4/3]"
        imgClassName="group-hover:scale-105"
        fallbackLabel="Photo coming soon"
      />
      <div className="flex flex-1 flex-col p-4">
        <h4 className="text-base font-semibold text-stone-900 transition group-hover:text-amber-800">
          {modelName}
        </h4>
        {brand && <p className="mt-1 text-sm text-stone-500">{brand}</p>}
      </div>
    </article>
  )

  return (
    <Link
      to={to}
      className="group block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
      aria-label={`${brand ? `${brand} ` : ''}${modelName}`}
    >
      {card}
    </Link>
  )
}
