import { Fragment } from 'react'
import { ContentMarker } from '@/components/content/ContentMarker'
import { showContentMarkers } from '@/config/site'
import { business, formatAddress } from '@/data/business'
import { legalName } from '@/data/legal'
import { valueOf } from '@/lib/content'
import { formatPhoneDisplay, getEmailUrl, getPhoneUrl, getWhatsAppUrl } from '@/lib/links'

const link = 'text-fg underline decoration-rule underline-offset-[0.3em] hover:decoration-fg break-words'

/**
 * Renders legal copy, filling {{tokens}} from central business data. A
 * missing legal name renders the preview-only marker (production is blocked).
 */
export function LegalText({ text }: { text: string }) {
  // Client preview (markers hidden) with no legal name yet: name the salon only, never an invented entity.
  const source = !legalName && !showContentMarkers ? text.replace('{{legalName}}, trading as ', '') : text
  const parts = source.split(/(\{\{\w+\}\})/g)
  return (
    <>
      {parts.map((part, i) => {
        const m = /^\{\{(\w+)\}\}$/.exec(part)
        if (!m) return <Fragment key={i}>{part}</Fragment>
        return <Fragment key={i}>{token(m[1]!)}</Fragment>
      })}
    </>
  )
}

function token(name: string) {
  const address = valueOf(business.address)
  const phone = valueOf(business.phone)
  const whatsapp = valueOf(business.whatsapp)
  const email = valueOf(business.email)
  switch (name) {
    case 'tradingName':
      return business.name
    case 'legalName':
      return legalName ?? <ContentMarker kind="legalName" inline />
    case 'address':
      return address ? formatAddress(address) : <ContentMarker inline>address</ContentMarker>
    case 'email':
      return email ? <a href={getEmailUrl(email, 'Privacy or terms question') ?? undefined} className={link}>{email}</a> : <ContentMarker inline>email address</ContentMarker>
    case 'phone':
      return phone ? <a href={getPhoneUrl() ?? undefined} className={link}>{formatPhoneDisplay(phone)}</a> : <ContentMarker inline>phone number</ContentMarker>
    case 'whatsapp': {
      const url = getWhatsAppUrl()
      return whatsapp && url ? <a href={url} target="_blank" rel="noopener noreferrer" className={link}>{formatPhoneDisplay(whatsapp)}<span className="sr-only"> on WhatsApp (opens in a new tab)</span></a> : <ContentMarker inline>WhatsApp number</ContentMarker>
    }
    default:
      throw new Error(`Unknown legal token {{${name}}}`)
  }
}
