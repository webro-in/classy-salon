import raw from '@content/consent.json'
import { parseContent } from '@/lib/content'
import { consentSchema } from '@/types/content'

export const consent = parseContent('consent', consentSchema, raw)
export const peopleConsentConfirmed = consent.peopleInMedia.status === 'verified'
