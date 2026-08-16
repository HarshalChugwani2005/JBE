import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." />
      <div className="py-16 text-center">
        <p className="text-6xl font-bold text-amber-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-stone-900">Page Not Found</h1>
        <p className="mt-2 text-stone-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-700"
          >
            Go Home
          </Link>
          <Link
            to="/catalog"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-amber-400 hover:text-amber-800"
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    </>
  )
}
