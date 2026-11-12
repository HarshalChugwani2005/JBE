import { useCompare } from '../context/useCompare'
import { useLanguage } from '../context/useLanguage'
import { CheckIcon } from './Icons'

/**
 * "Compare" checkbox-style toggle button for a product (aria-pressed shows the state).
 * `variant`: 'card' (small, in product cards) or 'modal' (full-width row in the product modal).
 */
export default function CompareToggle({ categorySlug, modelName, productName, variant = 'card', className = '' }) {
  const { isCompared, toggleCompare } = useCompare()
  const { t } = useLanguage()
  const active = isCompared(categorySlug, modelName)

  const box = (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
        active ? 'border-amber-700 bg-amber-700 text-white' : 'border-stone-400 bg-white text-transparent'
      }`}
      aria-hidden="true"
    >
      <CheckIcon className="h-3 w-3" />
    </span>
  )

  const styles =
    variant === 'modal'
      ? `btn col-span-2 border border-dashed px-3 py-2.5 text-sm ${
          active ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-stone-300 bg-white text-stone-700 hover:border-amber-400 hover:bg-amber-50/50'
        }`
      : `relative z-10 inline-flex min-h-9 items-center gap-2 rounded-lg px-1.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
          active ? 'text-amber-900' : 'text-stone-600 hover:text-amber-900'
        }`

  return (
    <button
      type="button"
      onClick={() => toggleCompare(categorySlug, modelName)}
      aria-pressed={active}
      aria-label={t('compareToggleLabel', { name: productName })}
      className={`${styles} ${className}`}
    >
      {box}
      <span>{variant === 'modal' && active ? t('compareSelected') : t('compare')}</span>
    </button>
  )
}
