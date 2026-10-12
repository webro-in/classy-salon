import { PATHS } from '@/app/paths'

export interface NavItem {
  label: string
  to: string
}

/** Header order. The services label is always "Our Services", never "Menu". */
export const primaryNav: NavItem[] = [
  { label: 'Home', to: PATHS.home },
  { label: 'About', to: PATHS.about },
  { label: 'Our Services', to: PATHS.services },
  { label: 'Gallery', to: PATHS.gallery },
  { label: 'Reviews', to: PATHS.reviews },
  { label: 'Contact', to: PATHS.contact },
]

export const legalNav: NavItem[] = [
  { label: 'Privacy Policy', to: PATHS.privacy },
  { label: 'Terms & Conditions', to: PATHS.terms },
]

export const bookingCta = { label: 'Book Now', to: `${PATHS.contact}#book` }
