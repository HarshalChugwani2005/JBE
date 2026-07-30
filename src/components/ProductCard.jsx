export default function ProductCard({ modelName, brand, image, category }) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex h-32 items-center justify-center rounded bg-gray-100 text-sm text-gray-400">
        {image ? `${category}/${image}` : 'No image'}
      </div>
      <h4 className="mt-3 font-medium text-gray-900">{modelName}</h4>
      {brand && <p className="text-sm text-gray-500">{brand}</p>}
    </article>
  )
}
