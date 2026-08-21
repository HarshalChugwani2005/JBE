import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { shop } from '../data/site'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-auto border-t border-stone-200/80 bg-white pb-20 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-600 to-orange-500 text-white text-xs font-black shadow-xs">
                ⚡
              </span>
              <p className="font-heading font-extrabold text-stone-900 text-base">{shop.name}</p>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-xs">{shop.tagline}</p>
          </div>
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-wider text-stone-900">{t('address')}</p>
            <p className="mt-2 text-xs sm:text-sm text-stone-600">{shop.address}</p>
            <p className="text-xs sm:text-sm text-stone-600">{shop.city}</p>
          </div>
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-wider text-stone-900">{t('quickLinks')}</p>
            <nav aria-label="Footer navigation" className="mt-2">
              <ul className="flex flex-col gap-1.5 text-xs sm:text-sm">
                <li>
                  <Link to="/catalog" className="text-stone-600 hover:text-amber-800 font-medium transition duration-150 inline-flex items-center gap-1">
                    <span>→</span>
                    <span>{t('navCatalog')}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-stone-600 hover:text-amber-800 font-medium transition duration-150 inline-flex items-center gap-1">
                    <span>→</span>
                    <span>{t('navContact')}</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <p className="mt-8 border-t border-stone-100 pt-6 text-center text-xs text-stone-400 font-medium">
          © {new Date().getFullYear()} {shop.name}. {t('allPricesOnEnquiry')}
        </p>
      </div>
    </footer>
  )
}
