/**
 * FAQ (Contact page). Questions AND answers come only from the client
 * (content/faq.json). Empty until supplied: preview shows marked placeholders,
 * production renders no FAQ section at all. Nothing is invented (no
 * cancellation, payment, walk-in, pricing, bridal or other policies).
 */
import raw from '@content/faq.json'
import { parseContent } from '@/lib/content'
import { faqSchema } from '@/types/content'

export const faqItems = parseContent('faq', faqSchema, raw).items
export type FaqItem = (typeof faqItems)[number]

export const faqCopy = {
  eyebrow: 'Before you visit',
  title: 'Questions',
  pendingSlots: 3,
} as const
