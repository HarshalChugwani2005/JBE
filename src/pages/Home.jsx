import { Link } from 'react-router-dom'
import { categories } from '../data/products'

export default function Home() {
  const featured = categories.slice(0, 4)

  return (
    <div>
      <section className="rounded-xl bg-blue-700 px-6 py-16 text-white">
        <h1 className="text-3xl font-bold">Jai Baba Electronic</h1>
        <p className="mt-3 max-w-xl text-blue-100">
          Wholesale &amp; retail electronics in Malkapur. Browse our catalog and
          enquire via WhatsApp or call.
        </p>
        <Link
          to="/catalog"
          className="mt-6 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
        >
          View Catalog
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900">Featured Categories</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((cat) => (
            <li key={cat.category}>
              <Link
                to={`/catalog/${cat.category}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300"
              >
                <span className="font-medium">{cat.categoryLabel}</span>
                {cat.comingSoon && (
                  <span className="ml-2 text-xs text-amber-600">Coming soon</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-gray-900">About</h2>
        <p className="mt-2 text-gray-600">
          Home page stub — hero, featured categories, and about sections will be
          fully built on Day 2.
        </p>
      </section>
    </div>
  )
}
