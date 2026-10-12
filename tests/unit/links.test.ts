import { describe, expect, it } from 'vitest'
import { buildEnquiryMessage, formatPhoneDisplay, getEmailUrl, getInstagramUrl, getMapsUrl, getPhoneUrl, getWhatsAppUrl } from '@/lib/links'

describe('contact link builders', () => {
  it('return null while client data is pending (no broken links can ship)', () => {
    expect(getWhatsAppUrl({}, null)).toBeNull()
    expect(getPhoneUrl(null)).toBeNull()
    expect(getEmailUrl(null)).toBeNull()
  })

  it('uses the verified salon WhatsApp and phone number', () => {
    expect(getWhatsAppUrl()!.startsWith('https://wa.me/918302555854?text=')).toBe(true)
    expect(getPhoneUrl()).toBe('tel:+918302555854')
    expect(formatPhoneDisplay('+918302555854')).toBe('+91 83025 55854')
  })

  it('builds a correctly encoded wa.me enquiry URL', () => {
    const url = getWhatsAppUrl({ name: 'Asha', service: 'Keratin Treatment', date: '12 Oct', time: '4 pm' }, '+919876543210')!
    expect(url.startsWith('https://wa.me/919876543210?text=')).toBe(true)
    const text = decodeURIComponent(url.split('?text=')[1]!)
    expect(text).toContain('Hello Classy Unisex Salon,')
    expect(text).toContain('Service: Keratin Treatment')
    expect(text).toContain('Preferred Time: 4 pm')
  })

  it('enquiry message never claims a confirmed booking', () => {
    expect(buildEnquiryMessage().toLowerCase()).not.toMatch(/confirm/)
  })

  it('builds tel: and mailto: links', () => {
    expect(getPhoneUrl('+91 98765 43210')).toBe('tel:+919876543210')
    expect(getEmailUrl('hello@example.com', 'Appointment')).toBe('mailto:hello@example.com?subject=Appointment')
    expect(formatPhoneDisplay('+919876543210')).toBe('+91 98765 43210')
  })

  it('uses verified Maps and primary Instagram only', () => {
    expect(getMapsUrl()).toBe('https://maps.app.goo.gl/C98q7iEKJztyNwsh6?g_st=iw') // exact client-supplied link
    expect(getInstagramUrl('primary')).toBe('https://www.instagram.com/classysalonjaipur/')
    expect(getInstagramUrl('secondary')).toBe('https://www.instagram.com/classy_salonjaipur/')
    expect(getEmailUrl()).toBe('mailto:Classysalonjaipur@gmail.com?subject=Enquiry')
  })
})
