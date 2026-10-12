/**
 * Contact / Visit page copy (WEBRO draft, client review). All business facts
 * (address, hours, phone, WhatsApp, email, Maps, Instagram, rating) come from
 * content/business.json via src/data/business.ts and src/lib/links.ts.
 */
export const contactCopy = {
  hero: {
    title: 'Contact / Visit',
    lead: 'Find us in Jagatpura, call or message us, or send an appointment enquiry on WhatsApp.',
  },
  details: {
    eyebrow: 'Visit',
    title: 'Where to find us',
    copy: 'Copy address',
    copied: 'Address copied',
    copyFailed: 'Could not copy: please select the address',
    directions: 'Get directions',
    hours: 'Opening hours',
    contact: 'Contact',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    email: 'Email',
    instagram: 'Instagram',
    call: 'Call now',
    whatsappAction: 'WhatsApp us',
    rating: 'Google rating',
    readReviews: 'Read reviews',
  },
  map: {
    eyebrow: 'Location',
    title: 'On the map',
    show: 'Show map',
    note: 'Loads Google Maps',
    open: 'Open in Google Maps',
    frameTitle: 'Map: Classy Unisex Salon, Jagatpura, Jaipur',
  },
  enquiry: {
    eyebrow: 'Appointment enquiry',
    title: 'Tell us when you would like to come in.',
    lead: 'Choose a service and a preferred date and time. Your enquiry opens in WhatsApp, ready to send. The salon replies to confirm availability.',
  },
  cta: {
    eyebrow: 'Keep exploring',
    title: 'Explore Classy.',
    links: [
      { label: 'Our Services', to: '/services', note: 'Hair, skin and makeup' },
      { label: 'Gallery', to: '/gallery', note: 'Real work and the salon' },
      { label: 'Reviews', to: '/reviews', note: 'What clients say' },
    ],
  },
} as const
