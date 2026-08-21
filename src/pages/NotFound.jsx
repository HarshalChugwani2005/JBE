import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." />
      <div className="py-20 text-center">
        <p className="font-heading text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-amber-600 to-orange-500">404</p>
        <h1 className="mt-4 font-heading text-2xl font-bold text-stone-900 sm:text-3xl">Page Not Found</h1>
        <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="glow-amber inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-amber-700 hover:to-orange-600"
          >
            Go Home
          </Link>
          <Link
            to="/catalog"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-bold text-stone-800 shadow-xs transition hover:border-stone-300 hover:bg-stone-50"
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    </>
  )
}
