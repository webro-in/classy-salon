import { Link } from 'react-router-dom'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildBreadcrumbJsonLd, type Crumb } from '@/config/seo'
import { cx } from '@/lib/cx'

/** Visible breadcrumb trail + matching BreadcrumbList structured data. */
export function Breadcrumbs({ trail, className }: { trail: Crumb[]; className?: string }) {
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(trail)} />
      <nav aria-label="Breadcrumb" className={cx('label text-fg-muted', className)}>
        <ol className="flex flex-wrap items-center gap-x-3">
          {trail.map((c, i) => {
            const last = i === trail.length - 1
            return (
              <li key={c.path} className="flex items-center gap-3">
                {last ? (
                  <span aria-current="page" className="text-fg">{c.name}</span>
                ) : (
                  <Link to={c.path} className="inline-flex min-h-11 items-center no-underline hover:text-fg hover:underline underline-offset-[0.35em]">{c.name}</Link>
                )}
                {!last && <span aria-hidden="true" className="h-px w-5 bg-rule" />}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
