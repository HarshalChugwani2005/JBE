import { Link } from 'react-router-dom'
import { shop } from '../data/site'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <p className="font-semibold text-stone-900">{shop.name}</p>
            <p className="mt-1 text-sm text-stone-600">{shop.tagline}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-stone-900">Address</p>
            <p className="mt-1 text-sm text-stone-600">{shop.address}</p>
            <p className="text-sm text-stone-600">{shop.city}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-stone-900">Quick Links</p>
            <p className="mt-2 flex flex-col gap-1 text-sm">
              <Link to="/catalog" className="text-amber-700 hover:text-amber-900">
                Browse catalog
              </Link>
              <Link to="/contact" className="text-amber-700 hover:text-amber-900">
                Contact us
              </Link>
            </p>
          </div>
        </div>
        <p className="mt-8 border-t border-stone-100 pt-6 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} {shop.name}. All prices on enquiry.
        </p>
      </div>
    </footer>
  )
}
