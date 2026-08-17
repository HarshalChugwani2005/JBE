import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { shop } from '../data/site'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-auto border-t border-stone-200 bg-white pb-16 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <p className="font-semibold text-stone-900">{shop.name}</p>
            <p className="mt-1 text-sm text-stone-600">{shop.tagline}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-stone-900">{t('address')}</p>
            <p className="mt-1 text-sm text-stone-600">{shop.address}</p>
            <p className="text-sm text-stone-600">{shop.city}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-stone-900">{t('quickLinks')}</p>
            <nav aria-label="Footer navigation" className="mt-2">
              <ul className="flex flex-col gap-1 text-sm">
                <li>
                  <Link to="/catalog" className="text-amber-700 hover:text-amber-900">
                    {t('navCatalog')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-amber-700 hover:text-amber-900">
                    {t('navContact')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <p className="mt-8 border-t border-stone-100 pt-6 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} {shop.name}. {t('allPricesOnEnquiry')}
        </p>
      </div>
    </footer>
  )
}
