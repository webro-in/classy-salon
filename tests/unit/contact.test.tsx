import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { addressLines, addressSingleLine, business, hoursOn, hoursRows, openStatus } from '@/data/business'
import { allServices, displayLabel } from '@/data/services'
import { buildEnquiryMessage, getWhatsAppUrl } from '@/lib/links'
import { EnquiryForm, validateEnquiry } from '@/components/forms/EnquiryForm'
import { ContactDetails } from '@/sections/contact/ContactDetails'

describe('client contact data (content/business.json)', () => {
  it('holds the client-supplied values, all verified', () => {
    expect(business.phone).toMatchObject({ status: 'verified', value: '+918302555854' })
    expect(business.whatsapp).toMatchObject({ status: 'verified', value: '+918302555854' })
    expect(business.email).toMatchObject({ status: 'verified', value: 'Classysalonjaipur@gmail.com' })
    expect(business.mapsUrl).toMatchObject({ status: 'verified', value: 'https://maps.app.goo.gl/C98q7iEKJztyNwsh6?g_st=iw' })
    expect(business.instagram.map((i) => [i.handle, i.url.status])).toEqual([['classysalonjaipur', 'verified'], ['classy_salonjaipur', 'verified']])
    expect(addressLines).toEqual(['Plot no. 210, Vishwa Vidhyalaya Nagar', 'Jagatpura', 'Jaipur, Rajasthan 302017'])
    expect(addressSingleLine).toBe('Classy Unisex Salon, Plot no. 210, Vishwa Vidhyalaya Nagar, Jagatpura, Jaipur, Rajasthan 302017')
    expect(hoursRows).toEqual([{ label: 'Every day', time: '9:30 AM – 9:30 PM' }])
  })

  it('open status follows the verified hours at the salon’s local time (IST)', () => {
    expect(openStatus(new Date('2026-10-02T06:00:00Z'))).toEqual({ open: true, label: 'Open now · until 9:30 PM' }) // 11:30 IST
    expect(openStatus(new Date('2026-10-02T02:00:00Z'))).toEqual({ open: false, label: 'Closed now · opens 9:30 AM' }) // 07:30 IST
    expect(openStatus(new Date('2026-10-02T17:00:00Z'))).toEqual({ open: false, label: 'Closed now · opens tomorrow 9:30 AM' }) // 22:30 IST
    expect(hoursOn('2026-10-04')).toEqual({ opens: '09:30', closes: '21:30' })
  })
})

describe('<ContactDetails>', () => {
  it('renders address, hours, phone, WhatsApp, email, both Instagram accounts and the rating from data', () => {
    render(<MemoryRouter><ContactDetails /></MemoryRouter>)
    expect(document.querySelector('[data-address]')).toHaveTextContent('Plot no. 210, Vishwa Vidhyalaya Nagar')
    expect(document.querySelector('[data-hours]')).toHaveTextContent('Every day9:30 AM – 9:30 PM')
    const rows = document.querySelector('[data-contact-rows]') as HTMLElement
    expect(within(rows).getByRole('link', { name: '+91 83025 55854' })).toHaveAttribute('href', 'tel:+918302555854')
    expect(within(rows).getByRole('link', { name: /on WhatsApp/ }).getAttribute('href')).toMatch(/^https:\/\/wa\.me\/918302555854\?text=/)
    expect(within(rows).getByRole('link', { name: 'Classysalonjaipur@gmail.com' })).toHaveAttribute('href', 'mailto:Classysalonjaipur@gmail.com?subject=Enquiry')
    expect(within(rows).getByRole('link', { name: /@classysalonjaipur/ })).toHaveAttribute('href', 'https://www.instagram.com/classysalonjaipur/')
    expect(within(rows).getByRole('link', { name: /@classy_salonjaipur/ })).toHaveAttribute('href', 'https://www.instagram.com/classy_salonjaipur/')
    expect(rows).toHaveTextContent('4.8out of 5 · 1500+ Google reviews')
    expect(screen.getByRole('link', { name: /Get directions/ })).toHaveAttribute('href', 'https://maps.app.goo.gl/C98q7iEKJztyNwsh6?g_st=iw')
    expect(document.querySelector('[data-content-marker]')).toBeNull()
  })
})

describe('appointment enquiry', () => {
  afterEach(() => vi.restoreAllMocks())
  const today = '2026-10-02'

  it('validates every field, including past dates and times outside opening hours', () => {
    expect(validateEnquiry({ name: '', service: '', date: '', time: '' }, today)).toEqual({
      name: 'Please enter your name.', service: 'Please choose a service.', date: 'Please choose a preferred date.', time: 'Please choose a preferred time.',
    })
    expect(validateEnquiry({ name: 'A', service: 'HD Makeup', date: '2026-10-01', time: '10:00' }, today).date).toMatch(/today or a later date/)
    expect(validateEnquiry({ name: 'A', service: 'HD Makeup', date: '2026-10-03', time: '08:00' }, today).time).toBe('Please choose a time between 9:30 AM and 9:30 PM (opening hours).')
    expect(validateEnquiry({ name: 'A', service: 'HD Makeup', date: '2026-10-03', time: '21:30' }, today)).toEqual({})
  })

  it('service options come from the central services data (no second list)', () => {
    render(<EnquiryForm location="test" requireAll />)
    const options = Array.from(document.querySelectorAll('select[name="service"] option')).map((o) => o.textContent).filter((t) => t !== 'Choose a service')
    expect(options).toEqual(allServices.map(displayLabel))
  })

  it('shows accessible inline errors and focuses the first invalid field', () => {
    render(<EnquiryForm location="test" requireAll />)
    fireEvent.click(screen.getByRole('button', { name: /Send enquiry on WhatsApp/ }))
    const name = screen.getByLabelText(/^Name/)
    expect(name).toHaveAttribute('aria-invalid', 'true')
    expect(document.getElementById(name.getAttribute('aria-describedby')!)).toHaveTextContent('Please enter your name.')
    expect(document.activeElement).toBe(name)
    expect(document.querySelectorAll('[data-field-error]')).toHaveLength(4)
  })

  it('valid submission opens WhatsApp with the selected service and shows a handoff state, never a confirmation', () => {
    const win = { opener: {} } as unknown as Window
    const open = vi.spyOn(window, 'open').mockReturnValue(win)
    render(<EnquiryForm location="test" requireAll />)
    fireEvent.change(screen.getByLabelText(/^Name/), { target: { value: 'Asha' } })
    fireEvent.change(screen.getByLabelText(/^Service/), { target: { value: 'Bridal Makeup' } })
    const future = new Date(Date.now() + 3 * 864e5)
    const iso = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, '0')}-${String(future.getDate()).padStart(2, '0')}`
    fireEvent.change(screen.getByLabelText(/^Preferred date/), { target: { value: iso } })
    fireEvent.change(screen.getByLabelText(/^Preferred time/), { target: { value: '11:00' } })
    fireEvent.click(screen.getByRole('button', { name: /Send enquiry on WhatsApp/ }))
    expect(open).toHaveBeenCalledTimes(1)
    const url = open.mock.calls[0]![0] as string
    expect(url.startsWith('https://wa.me/918302555854?text=')).toBe(true)
    const text = decodeURIComponent(url.split('?text=')[1]!)
    expect(text).toBe(`Hello Classy Unisex Salon,\n\nI would like to enquire about an appointment.\n\nName: Asha\nService: Bridal Makeup\nPreferred Date: ${iso}\nPreferred Time: 11:00\n\nThank you.`)
    expect(win.opener).toBeNull()
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent(/WhatsApp opened/)
    expect(document.body.textContent).not.toMatch(/booking confirmed|appointment (is )?confirmed/i)
  })

  it('the default (Home) form keeps fields optional', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue({ opener: null } as unknown as Window)
    render(<EnquiryForm location="home" />)
    fireEvent.click(screen.getByRole('button', { name: /Send enquiry on WhatsApp/ }))
    expect(open).toHaveBeenCalledWith(getWhatsAppUrl({ name: '', service: '', date: '', time: '' }), '_blank')
    expect(buildEnquiryMessage().toLowerCase()).not.toMatch(/confirm/)
  })
})
