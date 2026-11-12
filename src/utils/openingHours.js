/**
 * "Open now" logic, always evaluated in the shop's time zone (Asia/Kolkata) — a visitor's
 * phone set to another zone still sees the shop's real status.
 */
import { shop } from '../data/site.js'

const WEEKDAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Day of week (0 = Sunday) and minutes since midnight in the shop's time zone. */
export function shopClock(date = new Date(), timeZone = shop.timeZone) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  )
  return { day: WEEKDAYS[parts.weekday], minutes: Number(parts.hour) * 60 + Number(parts.minute) }
}

function hoursFor(day, openingHours) {
  return openingHours.find((slot) => slot.days.includes(day)) ?? null
}

/**
 * @returns {{ open: true, closesAt: string } |
 *           { open: false, opensAt: string, when: 'today' | 'tomorrow' | 'later', day: number } |
 *           null}  null when the shop has no hours at all
 */
export function getOpenStatus(date = new Date(), openingHours = shop.openingHours, timeZone = shop.timeZone) {
  const { day, minutes } = shopClock(date, timeZone)
  const today = hoursFor(day, openingHours)

  if (today && minutes >= toMinutes(today.opens) && minutes < toMinutes(today.closes)) {
    return { open: true, closesAt: today.closes }
  }
  if (today && minutes < toMinutes(today.opens)) {
    return { open: false, opensAt: today.opens, when: 'today', day }
  }
  for (let ahead = 1; ahead <= 7; ahead += 1) {
    const nextDay = (day + ahead) % 7
    const slot = hoursFor(nextDay, openingHours)
    if (slot) return { open: false, opensAt: slot.opens, when: ahead === 1 ? 'tomorrow' : 'later', day: nextDay }
  }
  return null
}

/** "20:00" → "8:00 PM" / "८:०० PM" / "8:00 pm" in the visitor's language. */
export function formatShopTime(hhmm, lang) {
  const [h, m] = hhmm.split(':').map(Number)
  const date = new Date(Date.UTC(2024, 0, 1, h, m))
  return new Intl.DateTimeFormat(`${lang}-IN`, { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }).format(date)
}

/** Localized weekday name for 0 = Sunday … 6 = Saturday. */
export function formatWeekday(day, lang) {
  // 2024-01-07 was a Sunday.
  return new Intl.DateTimeFormat(`${lang}-IN`, { weekday: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 7 + day)))
}
