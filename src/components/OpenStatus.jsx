import { useEffect, useState } from 'react'
import { useLanguage } from '../context/useLanguage'
import { formatShopTime, formatWeekday, getOpenStatus } from '../utils/openingHours'

/**
 * Live "Open now · Closes at 8:00 PM" / "Closed · Opens tomorrow at 9:00 AM" badge.
 * Depends on the current time, so it renders after mount (never in the pre-rendered HTML,
 * which would be stale) and refreshes every minute.
 *
 * tone: 'light' (on white) | 'dark' (on the hero gradient)
 */
export default function OpenStatus({ tone = 'light', className = '' }) {
  const { t, lang } = useLanguage()
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const update = () => setStatus(getOpenStatus())
    update()
    const timer = setInterval(update, 60 * 1000)
    return () => clearInterval(timer)
  }, [])

  if (!status) return null

  const time = formatShopTime(status.open ? status.closesAt : status.opensAt, lang)
  let detail
  if (status.open) detail = t('closesAt', { time })
  else if (status.when === 'today') detail = t('opensTodayAt', { time })
  else if (status.when === 'tomorrow') detail = t('opensTomorrowAt', { time })
  else detail = t('opensOnAt', { day: formatWeekday(status.day, lang), time })

  const palette =
    tone === 'dark'
      ? status.open
        ? 'border-emerald-300/40 bg-emerald-950/40 text-emerald-50'
        : 'border-amber-200/40 bg-black/25 text-amber-50'
      : status.open
        ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
        : 'border-stone-200 bg-stone-100 text-stone-800'

  return (
    <p
      className={`inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-full border px-3 py-1 text-xs font-semibold ${palette} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-2 w-2 shrink-0 rounded-full ${status.open ? 'bg-emerald-500' : 'bg-stone-400'}`}
      />
      <span>{status.open ? t('openNow') : t('closedNow')}</span>
      <span aria-hidden="true">·</span>
      <span>{detail}</span>
    </p>
  )
}
