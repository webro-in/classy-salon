import type { ReactNode } from 'react'
import { Seo } from '@/components/seo/Seo'
import { Container } from '@/components/layout/Container'
import { Section, type Tone } from '@/components/layout/Section'
import { Rule } from '@/components/layout/Rule'
import { Button } from '@/components/buttons/Button'
import { ActionLink } from '@/components/buttons/ActionLink'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Media } from '@/components/media/Media'
import { Reveal } from '@/components/motion/Reveal'
import { Optional3D } from '@/components/three/Optional3D'
import { Eyebrow, Heading, Lead, Numeral, Text } from '@/components/typography/Typography'
import { brandsHeading, logoBrands, nameBrands } from '@/data/brands'
import { business } from '@/data/business'
import { mediaSlots, mediaStats } from '@/data/media'
import { displayLabel, serviceGroups } from '@/data/services'
import { copyOf } from '@/lib/content'

/**
 * Internal foundation reference (noindex, excluded from the sitemap and from
 * strict production builds). Verifies tokens, type, tones, components, data
 * and the media/3D fallbacks in one place.
 */

const swatches = [
  ['ivory', '#FFFFFF'], ['cream', '#F8F6F2'], ['taupe', '#EFE9E1'], ['oak', '#C9B79E'],
  ['ink', '#17140F'], ['ink-muted', '#6B6158'], ['line', '#E5DED4'], ['brass', '#9A7444'],
  ['brass-strong', '#7A5A33'], ['brass-soft', '#C9A674'], ['night', '#191714'], ['on-night', '#EFE8DD'],
] as const

const tones: Tone[] = ['ivory', 'cream', 'taupe', 'dark']

function Block({ id, title, tone = 'ivory', children }: { id: string; title: string; tone?: Tone; children: ReactNode }) {
  return (
    <Section tone={tone} spacing="small" labelledBy={id}>
      <Container>
        <Heading id={id} size="h3" className="mb-8">{title}</Heading>
        {children}
      </Container>
    </Section>
  )
}

export function Component() {
  return (
    <>
      <Seo route="styleguide" />
      <Section tone="ivory" spacing="small" labelledBy="sg-title">
        <Container>
          <Eyebrow>Internal · Phase 1 foundation</Eyebrow>
          <Heading as="h1" id="sg-title" size="display" className="mt-3">Classy design system</Heading>
          <Lead className="mt-4 max-w-prose text-fg-muted">Quiet atelier, richly told. Tokens, typography, tones, components, data and media fallbacks.</Lead>
        </Container>
      </Section>

      <Block id="sg-colour" title="Colour">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {swatches.map(([name, hex]) => (
            <li key={name}>
              <span className="block aspect-[4/3] border border-rule" style={{ background: hex }} />
              <span className="mt-2 block text-caption">{name}</span>
              <span className="block font-mono text-caption text-fg-muted">{hex}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="sg-type" title="Typography" tone="cream">
        <div className="space-y-6">
          <p className="font-display text-display-xl">Classy</p>
          <p className="font-display text-display">Display · Instrument Serif</p>
          <p className="font-display text-h1">Heading 1</p>
          <p className="font-display text-h2">Heading 2 <em>italic</em></p>
          <p className="font-display text-h3">Heading 3</p>
          <p className="font-display text-h4">Heading 4</p>
          <Rule />
          <Lead>Lead · Hanken Grotesk. Hair, skin and makeup at Classy Unisex Salon in Jagatpura, Jaipur.</Lead>
          <Text className="max-w-prose">Body · 17px / 1.65. The body face is a warm grotesk chosen to keep interface text crisp beside the editorial serif.</Text>
          <Text size="small" muted>Small · muted</Text>
          <Text size="caption" muted>Caption · muted</Text>
          <Eyebrow>Label · uppercase · 0.16em</Eyebrow>
          <div className="flex items-end gap-8"><Numeral>01</Numeral><Numeral>02</Numeral><Numeral>03</Numeral></div>
        </div>
      </Block>

      <Section tone="ivory" spacing="none" labelledBy="sg-tones">
        <h2 id="sg-tones" className="sr-only">Section tones and buttons</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-4">
          {tones.map((t) => (
            <div key={t} className={`tone-${t} bg-tone p-8 lg:p-10`}>
              <Eyebrow>tone-{t}</Eyebrow>
              <p className="mt-3 font-display text-h3 text-fg">Chapter heading</p>
              <Text muted className="mt-2">Muted supporting copy on this tone.</Text>
              <Rule className="my-6" />
              <div className="flex flex-col items-start gap-3">
                <Button variant="solid">Solid</Button>
                <Button variant="outline" icon="arrow" iconPosition="end">Outline</Button>
                <Button variant="text">Text link</Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Block id="sg-actions" title="Contact actions (centralised data)">
        <Text muted className="mb-6 max-w-prose">Pending client data renders a marker in previews and nothing in production, so no broken link can ship.</Text>
        <div className="flex flex-wrap gap-3">
          <ActionLink kind="whatsapp" location="styleguide" variant="solid" />
          <ActionLink kind="call" location="styleguide" />
          <ActionLink kind="email" location="styleguide" />
          <ActionLink kind="maps" location="styleguide" />
          <ActionLink kind="instagram" location="styleguide" />
        </div>
      </Block>

      <Block id="sg-media" title={`Media slots (${mediaStats.supplied}/${mediaStats.total} supplied)`} tone="cream">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <Media slot="introPortrait" shape="arch" />
          <Media slot="serviceHairImage" />
          <Media slot="work02" />
          <Media slot="heroVideo" />
        </div>
        <div className="mt-6"><Media slot="heroSlideMakeup" /></div>
        <div className="mt-6 grid grid-cols-3 gap-6 md:grid-cols-6">
          {logoBrands.slice(0, 6).map((b) => <Media key={b.id} slot={`brand.${b.id}`} />)}
        </div>
        <details className="mt-8">
          <summary className="label cursor-pointer">All {mediaStats.total} slots</summary>
          <ul className="mt-4 columns-1 font-mono text-caption text-fg-muted sm:columns-2 lg:columns-3">
            {mediaSlots.map((s) => <li key={s.id}>{s.id} · {s.ratio}{s.mobileRatio ? ` / ${s.mobileRatio}` : ''} · {s.status}</li>)}
          </ul>
        </details>
      </Block>

      <Block id="sg-services" title="Service data (client sheet)">
        <div className="grid gap-10 lg:grid-cols-3">
          {serviceGroups.map((g) => (
            <div key={g.id}>
              <div className="flex items-baseline gap-4">
                <span className="font-display text-h2 text-accent">{g.number}</span>
                <span className="font-display text-h3">{g.title}</span>
              </div>
              <Text muted size="small" className="mt-2">{copyOf(g.summary)}</Text>
              <ul className="mt-4 divide-y divide-rule border-y border-rule">
                {g.items.map((s) => (
                  <li key={s.id} className="py-3">
                    <span className="block">{displayLabel(s)}</span>
                    {s.flag && <ContentMarker kind="confirm" className="mt-1">{s.flag}</ContentMarker>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Block>

      <Block id="sg-brands" title={brandsHeading} tone="taupe">
        <ul className="grid grid-cols-3 border-l border-t border-rule">
          {logoBrands.map((b) => (
            <li key={b.id} className="flex aspect-[3/1.4] items-center justify-center border-b border-r border-rule p-4 text-center font-display text-h4">{b.name}</li>
          ))}
        </ul>
        <p className="mt-6 label text-fg-muted">{nameBrands.map((b) => b.name).join(' · ')}</p>
      </Block>

      <Block id="sg-rating" title="Rating state">
        {business.rating.status === 'verified' ? (
          <p className="font-display text-numeral">{business.rating.value.value}</p>
        ) : (
          <ContentMarker>{business.rating.note}</ContentMarker>
        )}
      </Block>

      <Block id="sg-motion" title="Motion & 3D" tone="dark">
        <Reveal stagger className="grid gap-6 md:grid-cols-3">
          {['Reveal 01', 'Reveal 02', 'Reveal 03'].map((r) => (
            <div key={r} className="border border-rule p-6"><span className="font-display text-h3">{r}</span></div>
          ))}
        </Reveal>
        <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden bg-night-raised">
          <Optional3D className="absolute inset-0" fallback={<Media slot="heroSlideSkin" fit="fill" />} />
        </div>
        <Text muted size="small" className="mt-3">3D renders only with WebGL2, ≥1024px, no reduced motion and no data saver; otherwise the media fallback shows.</Text>
      </Block>
    </>
  )
}
