export default function ProductCard({ modelName, brand, image, category }) {
  const placeholderText = image ? `${category}/${image}` : 'Image coming soon'

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex h-32 items-center justify-center rounded bg-gradient-to-br from-stone-100 to-stone-200 text-sm font-medium text-stone-500" aria-label={`${modelName} preview`}>
        {placeholderText}
      </div>
      <h4 className="mt-3 font-medium text-gray-900">{modelName}</h4>
      {brand && <p className="text-sm text-gray-500">{brand}</p>}
    </article>
  )
}
