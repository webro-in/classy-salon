import { showContentMarkers } from '@/config/site'
import { getSlot } from '@/data/media'
import type { Brand } from '@/types/content'

/**
 * One brand cell's content. Shows the official logo file once the client
 * supplies it (media slot `brand.<id>`). Until then: the brand name in type,
 * plus a clearly marked "LOGO PLACEHOLDER" tag in development/preview builds.
 * Production builds cannot ship placeholders: missing required logos block
 * `npm run build:production`.
 */
export function BrandLogo({ brand }: { brand: Brand }) {
  const slot = getSlot(`brand.${brand.id}`)
  if (slot.src) {
    return <img src={slot.src} alt={brand.name} loading="lazy" width={240} height={80} className="h-auto max-h-[46%] w-auto max-w-[72%] object-contain opacity-80 transition-opacity duration-(--duration-ui) hover:opacity-100" />
  }
  return (
    <span className="flex flex-col items-center gap-2 text-center" data-logo-placeholder={brand.id}>
      <span className="font-display text-[1.0625rem] leading-tight text-fg/85 sm:text-h4">{brand.name}</span>
      {showContentMarkers && (
        <span className="border border-dashed border-current px-1.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-fg-muted">Logo placeholder</span>
      )}
    </span>
  )
}
