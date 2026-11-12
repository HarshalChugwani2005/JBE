import { useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import EmptyState from '../components/EmptyState'
import { CartIcon, CloseIcon, CompareIcon, PlusIcon, ShareIcon, TrashIcon, WhatsAppIcon } from '../components/Icons'
import PageHeader from '../components/PageHeader'
import ProductImage from '../components/ProductImage'
import SEO from '../components/SEO'
import { useCart } from '../context/useCart'
import { useCompare } from '../context/useCompare'
import { useLanguage } from '../context/useLanguage'
import { useToast } from '../context/useToast'
import { getWhatsAppUrl } from '../data/site'
import { buildCompareMessage, buildProductEnquiryMessage } from '../i18n/whatsappMessages'
import { trackEnquiryCartAction, trackWhatsAppClick } from '../utils/analytics'
import { COMPARE_MAX, compareSearch, parseCompareSearch } from '../utils/compare'
import { similarModels } from '../utils/similarProducts'
import { slugify } from '../utils/slugify'

/**
 * Side-by-side comparison of up to 3 models from one category.
 * The list lives in CompareProvider (localStorage); a shared link (?c=category&m=a,b) replaces it.
 * Not pre-rendered and noindex: the content is different for every visitor.
 */
export default function Compare() {
  const { list, items, restored, toggleCompare, removeFromCompare, clearCompare, replaceCompare } = useCompare()
  const { addToCart, openCart } = useCart()
  const { t, tCategory, tProduct, lang, href } = useLanguage()
  const { showToast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()

  // Opening a shared comparison link loads it (once the saved list has been restored, so it wins),
  // then drops the query so later edits aren't undone by a reload.
  useEffect(() => {
    if (!restored) return
    const shared = parseCompareSearch(location.search)
    if (location.search) navigate({ pathname: location.pathname, search: '' }, { replace: true })
    if (shared?.length) replaceCompare(shared)
  }, [restored, location.search, location.pathname, navigate, replaceCompare])

  const category = items[0]?.category
  const categoryName = category ? tCategory(category.category, category.categoryLabel) : ''
  const tierLabels = { budget: t('tierBudget'), mid: t('tierMid'), premium: t('tierPremium') }
  const nameOf = (item) => `${item.brand.brand} ${item.model.modelName}`
  const modelUrl = (item) => href(`/catalog/${item.categorySlug}/${item.modelSlug}`)

  // Other models from the same category, to fill the remaining slots.
  const suggestions = useMemo(() => {
    if (!items.length || items.length >= COMPARE_MAX) return []
    const picked = new Set(items.map((item) => item.modelSlug))
    return similarModels(items[0].categorySlug, items[0].model.modelName, items[0].model.priceTier, 8)
      .filter(({ model }) => !picked.has(slugify(model.modelName)))
      .slice(0, 6)
  }, [items])

  const columns = items.length < COMPARE_MAX ? items.length + 1 : COMPARE_MAX
  const gridStyle = { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }

  const addItemToList = (item) => {
    addToCart({
      categorySlug: item.categorySlug,
      categoryLabel: item.category.categoryLabel,
      brand: item.brand.brand,
      modelName: item.model.modelName,
      image: item.model.image,
    })
    trackEnquiryCartAction('add_item', { modelName: item.model.modelName, brand: item.brand.brand, category: item.categorySlug, source: 'compare' })
  }

  const handleAddAll = () => {
    items.forEach(addItemToList)
    showToast(t('compareAllAdded'), 'success')
    openCart()
  }

  const handleShare = async () => {
    const url = `${window.location.origin}${href('/compare')}${compareSearch(list)}`
    const title = `${t('compareTitle')}: ${items.map(nameOf).join(' / ')}`
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch (err) {
        if (err.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      showToast(t('copied'), 'success')
    } catch {
      showToast(t('copyFailed'), 'info')
    }
  }

  const compareWhatsApp = getWhatsAppUrl(
    buildCompareMessage(lang, { categoryLabel: categoryName, products: items.map(nameOf) }),
  )

  /** One comparison row: a label, then one cell per product (+ an empty cell for the free slot). */
  const row = (id, label, render) => (
    <section aria-labelledby={`compare-row-${id}`} className="border-t border-stone-200 py-4">
      <h2 id={`compare-row-${id}`} className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-600">
        {label}
      </h2>
      <div className="mt-2.5 grid gap-x-3 sm:gap-x-5" style={gridStyle}>
        {items.map((item) => {
          const value = render(item)
          return (
            <div key={item.modelSlug} className="min-w-0 text-xs leading-relaxed text-stone-800 sm:text-sm">
              <span className="sr-only">{nameOf(item)}: </span>
              {value || (
                <span className="text-stone-500">
                  <span aria-hidden="true">—</span>
                  <span className="sr-only">{t('compareNotListed')}</span>
                </span>
              )}
            </div>
          )
        })}
        {items.length < COMPARE_MAX && <div aria-hidden="true" />}
      </div>
    </section>
  )

  return (
    <>
      <SEO title={t('compareTitle')} description={t('seoCompareDescription')} noindex />
      <Breadcrumbs
        items={[
          { label: t('navHome'), to: href('/') },
          { label: t('navCatalog'), to: href('/catalog') },
          { label: t('compareTitle') },
        ]}
        className="mb-4"
      />
      <PageHeader
        title={t('compareTitle')}
        subtitle={items.length ? t('compareSubtitle', { category: categoryName, max: COMPARE_MAX }) : t('compareIntro', { max: COMPARE_MAX })}
      >
        {items.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={handleShare} className="btn btn-secondary min-h-10 px-3 py-2 text-xs sm:text-sm">
              <ShareIcon className="h-4 w-4" />
              <span>{t('compareShare')}</span>
            </button>
            <button
              type="button"
              onClick={clearCompare}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 sm:text-sm cursor-pointer"
            >
              <TrashIcon className="h-4 w-4" />
              <span>{t('compareClear')}</span>
            </button>
          </div>
        )}
      </PageHeader>

      {/* Until the saved list is read, show nothing rather than a flash of the empty state. */}
      {!restored ? (
        <div className="min-h-64" aria-hidden="true" />
      ) : items.length === 0 ? (
        <EmptyState icon={CompareIcon} title={t('compareEmptyTitle')} description={t('compareEmptyText', { max: COMPARE_MAX })} className="mt-8">
          <Link to={href('/catalog')} className="btn btn-primary">
            {t('heroBrowseCatalog')}
          </Link>
        </EmptyState>
      ) : (
        <>
          {/* Product heads */}
          <div className="mt-6 grid gap-x-3 sm:gap-x-5" style={gridStyle}>
            {items.map((item) => (
              <article key={item.modelSlug} className="relative flex min-w-0 flex-col rounded-2xl border border-stone-200 bg-white p-2 shadow-xs sm:p-3">
                <button
                  type="button"
                  onClick={() => removeFromCompare(item)}
                  aria-label={t('compareRemove', { name: nameOf(item) })}
                  className="absolute right-1 top-1 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-white/95 text-stone-600 shadow-xs transition hover:border-amber-400 hover:text-stone-900 cursor-pointer"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
                <Link to={modelUrl(item)} className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500">
                  <ProductImage
                    category={item.categorySlug}
                    product={item.model}
                    alt=""
                    sizes="(min-width: 1024px) 330px, 33vw"
                    className="aspect-square w-full overflow-hidden rounded-xl bg-stone-50"
                    imgClassName="object-contain p-2"
                  />
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-amber-800 sm:text-[11px]">{item.brand.brand}</p>
                  <p className="font-heading text-sm font-bold leading-snug text-stone-900 group-hover:text-amber-800 sm:text-base">
                    {item.model.modelName}
                  </p>
                </Link>
              </article>
            ))}
            {items.length < COMPARE_MAX && (
              <Link
                to={href(`/catalog/${items[0].categorySlug}`)}
                className="flex min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/60 p-3 text-center text-xs font-semibold text-stone-600 transition hover:border-amber-400 hover:bg-amber-50/50 hover:text-amber-900 sm:text-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-amber-800 shadow-xs">
                  <PlusIcon className="h-5 w-5" />
                </span>
                <span>{t('compareAddAnother', { category: categoryName })}</span>
              </Link>
            )}
          </div>

          <div className="mt-6">
            {row('highlight', t('compareRowHighlight'), (item) => {
              const text = item.model.tagline || item.brand.tagline
              return text && tProduct(text)
            })}
            {row('warranty', t('compareRowWarranty'), (item) => {
              const text = item.model.warranty || item.brand.warranty
              return text && <span className="font-semibold">{tProduct(text)}</span>
            })}
            {row('range', t('compareRowRange'), (item) => tierLabels[item.model.priceTier])}
            {row('colours', t('compareRowColours'), (item) =>
              item.model.colors?.length > 0 && (
                <>
                  <span className="font-semibold">{t('compareColourCount', { count: item.model.colors.length })}</span>
                  <span className="block text-stone-600">{item.model.colors.map((c) => tProduct(c)).join(', ')}</span>
                </>
              )
            )}
            {row('features', t('compareRowFeatures'), (item) =>
              item.model.specs?.length > 0 && (
                <ul className="space-y-1.5">
                  {item.model.specs.map((spec) => (
                    <li key={spec} className="flex gap-1.5">
                      <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                      <span className="min-w-0 wrap-break-word">{tProduct(spec)}</span>
                    </li>
                  ))}
                </ul>
              )
            )}
            {row('actions', t('compareRowEnquire'), (item) => (
              <div className="flex flex-col gap-2">
                <a
                  href={getWhatsAppUrl(
                    buildProductEnquiryMessage(lang, {
                      brand: item.brand.brand,
                      modelName: item.model.modelName,
                      categoryLabel: categoryName,
                      keySpec: item.model.specs?.[0],
                    }),
                  )}
                  onClick={() => trackWhatsAppClick('compare_item', { modelName: item.model.modelName })}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('compareAskPrice')} — ${nameOf(item)}`}
                  className="btn btn-whatsapp min-h-10 px-2 py-2 text-xs"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  <span>{t('compareAskPrice')}</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    addItemToList(item)
                    showToast(`${nameOf(item)} ${t('itemAdded')}`, 'success')
                  }}
                  aria-label={`${t('addToList')} — ${nameOf(item)}`}
                  className="btn btn-secondary min-h-10 px-2 py-2 text-xs"
                >
                  <CartIcon className="h-4 w-4 shrink-0" />
                  <span>{t('addToList')}</span>
                </button>
              </div>
            ))}
          </div>

          {suggestions.length > 0 && (
            <section aria-labelledby="compare-suggestions" className="mt-4 rounded-2xl border border-stone-200 bg-stone-50/70 p-4 sm:p-5">
              <h2 id="compare-suggestions" className="font-heading text-sm font-bold text-stone-900 sm:text-base">
                {t('compareSuggestions', { category: categoryName })}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {suggestions.map(({ brand, model }) => (
                  <li key={model.modelName}>
                    <button
                      type="button"
                      onClick={() => toggleCompare(items[0].categorySlug, model.modelName)}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 sm:text-sm cursor-pointer"
                    >
                      <PlusIcon className="h-3.5 w-3.5 text-amber-800" />
                      <span>
                        {brand.brand} {model.modelName}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-center sm:p-8">
            <h2 className="font-heading text-lg font-bold text-stone-900 sm:text-xl">{t('compareHelpTitle')}</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-stone-700">{t('compareHelpText')}</p>
            <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <a
                href={compareWhatsApp}
                onClick={() => trackWhatsAppClick('compare_all', { count: items.length })}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>{t('compareAskAll')}</span>
              </a>
              <button type="button" onClick={handleAddAll} className="btn btn-secondary">
                <CartIcon className="h-4 w-4" />
                <span>{t('compareAddAll')}</span>
              </button>
            </div>
          </section>
        </>
      )}
    </>
  )
}
