import { Link, NavLink } from 'react-router-dom'

const navLinkClass = ({ isActive }) =>
  isActive
    ? 'text-blue-700 font-medium'
    : 'text-gray-600 hover:text-gray-900'

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-semibold text-gray-900">
          Jai Baba Electronic
        </Link>
        <ul className="flex gap-6 text-sm">
          <li>
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/catalog" className={navLinkClass}>
              Catalog
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
