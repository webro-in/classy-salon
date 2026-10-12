import { Link } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Icon } from '@/components/icons/Icon'
import { Reveal } from '@/components/motion/Reveal'
import { contactCopy } from '@/data/contact'

/**
 * Final chapter: routes back into the site (Services, Gallery, Reviews) as
 * large editorial links. The dark footer that follows carries Book / WhatsApp,
 * so this section deliberately does not repeat them.
 */
export function ContactCta() {
  return (
    <Section tone="taupe" labelledBy="explore-title">
      <Container>
        <Reveal>
          <p className="label text-fg-muted">{contactCopy.cta.eyebrow}</p>
          <h2 id="explore-title" className="mt-4 font-display text-h2">{contactCopy.cta.title}</h2>
        </Reveal>
        <ul className="mt-10 border-t border-rule">
          {contactCopy.cta.links.map((l) => (
            <li key={l.to} className="border-b border-rule">
              <Link to={l.to} className="group grid grid-cols-[1fr_auto] items-baseline gap-4 py-6 no-underline md:grid-cols-[1fr_1fr_auto] md:py-8">
                <span className="font-display text-h3 text-fg transition-transform duration-(--duration-ui) ease-(--ease-out) group-hover:translate-x-1 motion-reduce:transition-none">{l.label}</span>
                <span className="col-start-1 row-start-2 text-small text-fg-muted md:col-start-2 md:row-start-1">{l.note}</span>
                <Icon name="arrow" size={18} className="col-start-2 row-start-1 text-fg md:col-start-3" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
