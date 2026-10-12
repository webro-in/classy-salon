import raw from '@content/business.json'
import { parseContent, valueOf } from '@/lib/content'
import { businessSchema, type PostalAddress } from '@/types/content'

export const business = parseContent('business', businessSchema, raw)

export function formatAddress(a: PostalAddress, separator = ', '): string {
  return [a.streetAddress, a.locality, `${a.city}, ${a.region} ${a.postalCode}`].join(separator)
}

export const addressLines: string[] = (() => {
  const a = valueOf(business.address)
  return a ? [a.streetAddress, a.locality, `${a.city}, ${a.region} ${a.postalCode}`] : []
})()

export const locationLine = 'Jagatpura, Jaipur'

/**
 * Google rating + review count, from content/business.json → rating (the one
 * place to update them). Null while pending, so nothing is shown.
 */
export const googleRating: { value: number; display: string; outOf: 5; count: number; countLabel: string; source: 'Google'; checkedOn?: string } | null = (() => {
  const r = business.rating
  if (r.status !== 'verified') return null
  return { value: r.value.value, display: r.value.value.toFixed(1), outOf: 5, count: r.value.count, countLabel: r.value.countLabel, source: r.value.source, ...(r.checkedOn && { checkedOn: r.checkedOn }) }
})()

const DAY_NAMES = { Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday' } as const

/** "09:30" → "9:30 AM", "21:30" → "9:30 PM". */
export function formatTime(hhmm: string): string {
  const [h = 0, m = 0] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

/** Display rows for verified opening hours ("Every day" when all seven days match). */
export const hoursRows: Array<{ label: string; time: string }> = (() => {
  const hours = valueOf(business.hours)
  if (!hours) return []
  return hours.map((h) => ({
    label: h.days.length === 7 ? 'Every day' : h.days.length > 2 ? `${DAY_NAMES[h.days[0]!]} – ${DAY_NAMES[h.days[h.days.length - 1]!]}` : h.days.map((d) => DAY_NAMES[d]).join(', '),
    time: `${formatTime(h.opens)} – ${formatTime(h.closes)}`,
  }))
})()

/** One-line summary, e.g. "Open every day · 9:30 AM – 9:30 PM". Null while pending. */
export const hoursSummary: string | null = hoursRows.length === 1 ? `Open ${hoursRows[0]!.label.toLowerCase()} · ${hoursRows[0]!.time}` : null

/** Current day/time at the salon (Asia/Kolkata), independent of the visitor's time zone. */
function salonNow(at: Date): { day: (typeof DAY_KEYS)[number]; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(at)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const day = ({ Mon: 'Mo', Tue: 'Tu', Wed: 'We', Thu: 'Th', Fri: 'Fr', Sat: 'Sa', Sun: 'Su' } as const)[get('weekday') as 'Mon']
  return { day, minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')) }
}
const DAY_KEYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const
const toMinutes = (hhmm: string) => { const [h = 0, m = 0] = hhmm.split(':').map(Number); return h * 60 + m }

/**
 * Open/closed status derived only from the verified hours (no holiday or
 * special schedules are known, so none are assumed). Null while hours are pending.
 */
export function openStatus(at: Date = new Date()): { open: boolean; label: string } | null {
  const hours = valueOf(business.hours)
  if (!hours) return null
  const now = salonNow(at)
  const today = hours.find((h) => h.days.includes(now.day))
  if (today && now.minutes >= toMinutes(today.opens) && now.minutes < toMinutes(today.closes)) {
    return { open: true, label: `Open now · until ${formatTime(today.closes)}` }
  }
  const opensToday = today && now.minutes < toMinutes(today.opens)
  if (opensToday) return { open: false, label: `Closed now · opens ${formatTime(today.opens)}` }
  const idx = DAY_KEYS.indexOf(now.day)
  for (let i = 1; i <= 7; i++) {
    const d = DAY_KEYS[(idx + i) % 7]!
    const next = hours.find((h) => h.days.includes(d))
    if (next) return { open: false, label: `Closed now · opens ${i === 1 ? 'tomorrow' : DAY_NAMES[d]} ${formatTime(next.opens)}` }
  }
  return { open: false, label: 'Closed now' }
}

/** Opening and closing time for a given date's weekday at the salon (used to bound enquiry times). */
export function hoursOn(isoDate: string): { opens: string; closes: string } | null {
  const hours = valueOf(business.hours)
  if (!hours || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null
  const day = DAY_KEYS[(new Date(`${isoDate}T12:00:00Z`).getUTCDay() + 6) % 7]!
  const h = hours.find((x) => x.days.includes(day))
  return h ? { opens: h.opens, closes: h.closes } : null
}

/** Single-line postal address for copying. */
export const addressSingleLine: string | null = (() => {
  const a = valueOf(business.address)
  return a ? `${business.name}, ${formatAddress(a)}` : null
})()
