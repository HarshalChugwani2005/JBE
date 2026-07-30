import { Link, NavLink } from 'react-router-dom'
import { shop } from '../data/site'

const navLinkClass = ({ isActive }) =>
  isActive
    ? 'text-amber-700 font-semibold'
    : 'text-stone-600 hover:text-stone-900'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link to="/" className="text-base font-bold text-stone-900 md:text-lg">
          {shop.name}
        </Link>
        <ul className="flex gap-4 text-sm md:gap-6">
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
