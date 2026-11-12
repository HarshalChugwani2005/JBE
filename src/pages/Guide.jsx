import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { ArrowRightIcon, WhatsAppIcon } from '../components/Icons'
import PageHeader from '../components/PageHeader'
import ProductImage from '../components/ProductImage'
import SEO from '../components/SEO'
import { useLanguage } from '../context/useLanguage'
import { getWhatsAppUrl } from '../data/site'
import { trackWhatsAppClick } from '../utils/analytics'
import { fanRecommendation, geyserRecommendation, ledRecommendation, roomArea, ROOM_LUX } from '../utils/buyingGuide'
import { slugify } from '../utils/slugify'

const inputClass =
  'mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600'
const labelClass = 'block text-xs font-bold uppercase tracking-wider text-stone-600'

function Card({ title, intro, children }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs sm:p-6">
      <h2 className="font-heading text-lg font-bold text-stone-900 sm:text-xl">{title}</h2>
      <p className="mt-1 text-sm text-stone-600">{intro}</p>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function NumberField({ label, value, onChange, min = 1, max = 100 }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </div>
  )
}

function Result({ label, children }) {
  return (
    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/70 p-4" aria-live="polite">
      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">{label}</p>
      <div className="mt-1 font-heading text-lg font-bold text-stone-900">{children}</div>
    </div>
  )
}

/** Suggested catalog products: [{ category, brand, model, prefix? }] */
function ProductSuggestions({ items }) {
  const { t, href, tCategory } = useLanguage()
  if (!items.length) return null
  return (
    <div className="mt-5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">{t('guideMatching')}</h3>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {items.map(({ category, brand, model, prefix }) => (
          <li key={`${category.category}-${model.modelName}`}>
            <Link
              to={href(`/catalog/${category.category}/${slugify(model.modelName)}`)}
              className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50/60 p-2 transition hover:border-amber-400 hover:bg-white"
            >
              <ProductImage
                category={category.category}
                product={model}
                alt=""
                fallbackLabel=""
                sizes="56px"
                className="h-14 w-14 shrink-0 rounded-lg"
                imgClassName="object-contain p-1"
              />
              <span className="min-w-0">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  {brand.brand} · {tCategory(category.category, category.categoryLabel)}
                </span>
                <span className="block truncate text-sm font-semibold text-stone-900">
                  {prefix}
                  {model.modelName}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function AskOnWhatsApp({ message, label, source }) {
  return (
    <a
      href={getWhatsAppUrl(message)}
      onClick={() => trackWhatsAppClick(source)}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-whatsapp mt-5 w-full sm:w-auto"
    >
      <WhatsAppIcon className="h-4 w-4" />
      <span>{label}</span>
    </a>
  )
}

function FanCalculator() {
  const { t, href } = useLanguage()
  const [length, setLength] = useState('12')
  const [width, setWidth] = useState('10')
  const area = roomArea(length, width)
  const rec = fanRecommendation(area)

  return (
    <Card title={t('guideFanTitle')} intro={t('guideFanIntro')}>
      <div className="grid grid-cols-2 gap-3">
        <NumberField label={t('roomLength')} value={length} onChange={setLength} />
        <NumberField label={t('roomWidth')} value={width} onChange={setWidth} />
      </div>
      {rec && (
        <>
          <Result label={t('roomArea', { area })}>
            {rec.portable ? t('guideFanPortable') : t('guideFanResult', { count: rec.count, sweep: rec.sweep })}
          </Result>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
            {rec.portable ? (
              <Link to={href('/catalog/table-fans')} className="btn btn-secondary mt-5 w-full sm:w-auto">
                <span>{t('browseModels')}</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <AskOnWhatsApp
                  source="guide_fan"
                  label={t('guideFanAsk', { sweep: rec.sweep })}
                  message={t('guideFanMessage', { area, sweep: rec.sweep })}
                />
                <Link to={href('/catalog/ceiling-fans')} className="btn btn-secondary mt-0 w-full sm:mt-5 sm:w-auto">
                  <span>{t('browseModels')}</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </Card>
  )
}

function LightingCalculator() {
  const { t } = useLanguage()
  const id = useId()
  const [roomType, setRoomType] = useState('bedroom')
  const [length, setLength] = useState('12')
  const [width, setWidth] = useState('10')
  const area = roomArea(length, width)
  const rec = ledRecommendation(area, roomType)
  const roomLabels = { bedroom: 'roomBedroom', living: 'roomLiving', kitchen: 'roomKitchen', study: 'roomStudy', shop: 'roomShop' }

  return (
    <Card title={t('guideLedTitle')} intro={t('guideLedIntro')}>
      <div>
        <label htmlFor={id} className={labelClass}>{t('roomType')}</label>
        <select id={id} value={roomType} onChange={(e) => setRoomType(e.target.value)} className={inputClass}>
          {Object.keys(ROOM_LUX).map((type) => (
            <option key={type} value={type}>{t(roomLabels[type])}</option>
          ))}
        </select>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <NumberField label={t('roomLength')} value={length} onChange={setLength} />
        <NumberField label={t('roomWidth')} value={width} onChange={setWidth} />
      </div>
      {rec && (
        <>
          <Result label={t('roomArea', { area })}>{t('guideLedResult', { lumens: rec.lumens.toLocaleString('en-IN') })}</Result>
          <ProductSuggestions items={rec.options.map((option) => ({ ...option, prefix: `${option.count} × ` }))} />
        </>
      )}
    </Card>
  )
}

function GeyserCalculator() {
  const { t } = useLanguage()
  const id = useId()
  const [use, setUse] = useState('bath')
  const [people, setPeople] = useState('4')
  const rec = geyserRecommendation(use, people)
  const useLabel = t(use === 'kitchen' ? 'geyserUseKitchen' : 'geyserUseBath')

  return (
    <Card title={t('guideGeyserTitle')} intro={t('guideGeyserIntro')}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={id} className={labelClass}>{t('geyserUse')}</label>
          <select id={id} value={use} onChange={(e) => setUse(e.target.value)} className={inputClass}>
            <option value="bath">{t('geyserUseBath')}</option>
            <option value="kitchen">{t('geyserUseKitchen')}</option>
          </select>
        </div>
        <NumberField label={t('peopleCount')} value={people} onChange={setPeople} max={20} />
      </div>
      {rec && (
        <>
          <Result label={t('guideRecommended')}>
            {t(rec.type === 'instant' ? 'guideGeyserInstant' : 'guideGeyserStorage', { min: rec.min, max: rec.max })}
          </Result>
          {rec.matches.length > 0 ? (
            <ProductSuggestions items={rec.matches} />
          ) : (
            <>
              <p className="mt-4 text-sm text-stone-700">{t('guideGeyserNoMatch')}</p>
              <AskOnWhatsApp
                source="guide_geyser"
                label={t('askUsOnWhatsApp')}
                message={t('guideGeyserMessage', { people, use: useLabel, min: rec.min, max: rec.max })}
              />
            </>
          )}
        </>
      )}
    </Card>
  )
}

export default function Guide() {
  const { t, href } = useLanguage()

  return (
    <>
      <SEO title={t('guideTitle')} description={t('seoGuideDescription')} />
      <Breadcrumbs items={[{ label: t('navHome'), to: href('/') }, { label: t('navGuide') }]} className="mb-4" />
      <PageHeader title={t('guideTitle')} subtitle={t('guideSubtitle')} />

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <FanCalculator />
        <LightingCalculator />
        <GeyserCalculator />
      </div>

      <p className="mt-8 rounded-2xl border border-stone-200 bg-white px-5 py-4 text-xs text-stone-600 shadow-xs sm:text-sm">
        {t('guideDisclaimer')}
      </p>
    </>
  )
}
