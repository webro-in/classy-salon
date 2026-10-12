import { Head } from 'vite-react-ssg'
import { absoluteUrl, site } from '@/config/site'
import { ogImageFor, routeSeo } from '@/config/seo'
import type { RouteKey } from '@/app/paths'
import { business } from '@/data/business'

/**
 * Per-route head tags, rendered into the prerendered HTML by vite-react-ssg.
 * All values come from src/config/seo.ts.
 */
export function Seo({ route }: { route: RouteKey | 'notFound' }) {
  const meta = routeSeo[route]
  const noindex = meta.noindex || site.staging
  const canonical = absoluteUrl(meta.path)
  const image = ogImageFor(meta)
  return (
    <Head>
      <html lang={site.language} />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : <meta name="robots" content="index, follow" />}
      {!noindex && <link rel="canonical" href={canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={business.name} />
      <meta property="og:locale" content={site.locale} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={image} />
    </Head>
  )
}
