import { useId, useState } from 'react'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Icon } from '@/components/icons/Icon'
import { Reveal } from '@/components/motion/Reveal'
import { showContentMarkers } from '@/config/site'
import { faqCopy, faqItems, type FaqItem } from '@/data/faq'
import { cx } from '@/lib/cx'

/**
 * FAQ accordion with client-supplied questions and answers only. Several
 * items may be open at once (easier to compare answers). Real buttons with
 * aria-expanded/aria-controls; collapsed panels are `inert`.
 * No content yet: marked placeholders in preview, nothing in production.
 */
export function ContactFaq() {
  if (faqItems.length === 0) {
    if (!showContentMarkers) return null
    return (
      <Section tone="ivory" labelledBy="faq-title">
        <Container>
          <Header />
          <ul className="mt-10 border-t border-rule" data-faq-pending>
            {Array.from({ length: faqCopy.pendingSlots }, (_, i) => (
              <li key={i} className="border-b border-dashed border-rule py-6">
                <ContentMarker kind="faq">question and answer {i + 1}, written by the salon (content/faq.json)</ContentMarker>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    )
  }
  return (
    <Section tone="ivory" labelledBy="faq-title">
      <Container>
        <Header />
        <ul className="mt-10 border-t border-rule">
          {faqItems.map((item) => <FaqRow key={item.id} item={item} />)}
        </ul>
      </Container>
    </Section>
  )
}

function Header() {
  return (
    <Reveal>
      <p className="label text-fg-muted">{faqCopy.eyebrow}</p>
      <h2 id="faq-title" className="mt-4 font-display text-h2">{faqCopy.title}</h2>
    </Reveal>
  )
}

export function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <li className="border-b border-rule" data-faq={item.id}>
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-start justify-between gap-6 py-6 text-left font-display text-h4 text-fg focus-visible:outline-offset-4"
        >
          <span>{item.question}</span>
          <span aria-hidden="true" className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-rule">
            <Icon name="plus" size={14} className={cx('transition-transform duration-(--duration-ui) ease-(--ease-out) motion-reduce:transition-none', open && 'rotate-45')} />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        inert={!open}
        className={cx('grid transition-[grid-template-rows,opacity] duration-(--duration-ui) ease-(--ease-out) motion-reduce:transition-none', open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}
      >
        <div className="overflow-hidden">
          <p className="max-w-[62ch] pb-8 text-body text-fg-muted">{item.answer}</p>
        </div>
      </div>
    </li>
  )
}
