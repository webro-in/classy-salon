import { Head } from 'vite-react-ssg'

/** Structured data, serialised into the static HTML. `<` is escaped to keep the script block safe. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(data).replace(/</g, '\\u003c')}</script>
    </Head>
  )
}
