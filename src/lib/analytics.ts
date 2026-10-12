/**
 * Frontend analytics abstraction. No backend. Provider is chosen by env;
 * 'none' is a silent no-op, so tracking calls are always safe.
 */
import { site } from '@/config/site'

export type AnalyticsEvent =
  | 'booking_click'
  | 'whatsapp_click'
  | 'phone_click'
  | 'email_click'
  | 'maps_click'
  | 'instagram_click'
  | 'media_error'
  | 'gallery_filter'
  | 'gallery_open'

type Props = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(event: AnalyticsEvent, props: Props = {}): void {
  if (typeof window === 'undefined') return
  try {
    if (site.analytics.provider === 'plausible') window.plausible?.(event, { props })
    else if (site.analytics.provider === 'ga4') window.gtag?.('event', event, props)
  } catch {
    // Analytics must never break the page.
  }
}

export const trackBookingClick = (location: string) => trackEvent('booking_click', { location })
export const trackWhatsAppClick = (location: string, service?: string) => trackEvent('whatsapp_click', { location, service })
export const trackPhoneClick = (location: string) => trackEvent('phone_click', { location })
export const trackEmailClick = (location: string) => trackEvent('email_click', { location })
export const trackMapsClick = (location: string) => trackEvent('maps_click', { location })
export const trackInstagramClick = (location: string) => trackEvent('instagram_click', { location })
