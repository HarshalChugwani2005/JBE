import { Link } from 'react-router-dom'

export default function CategoryCard({ category, categoryLabel, comingSoon }) {
  return (
    <Link
      to={`/catalog/${category}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
    >
      <h3 className="text-lg font-semibold text-gray-900">{categoryLabel}</h3>
      {comingSoon && (
        <span className="mt-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
          Coming soon
        </span>
      )}
    </Link>
  )
}
