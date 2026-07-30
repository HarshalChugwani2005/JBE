import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-600">
        <p className="font-medium text-gray-900">Jai Baba Electronic</p>
        <p className="mt-1">Buldana Road, Malkapur</p>
        <p className="mt-3">
          <Link to="/catalog" className="text-blue-700 hover:underline">
            Browse catalog
          </Link>
          {' · '}
          <Link to="/contact" className="text-blue-700 hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </footer>
  )
}
