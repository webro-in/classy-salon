import { PATHS, type RouteKey } from '@/app/paths'
import { business } from '@/data/business'
import { displayLabel, serviceGroups } from '@/data/services'
import { galleryItems, isOwnMedia, orderedGalleryItems } from '@/data/gallery'
import { valueOf } from '@/lib/content'
import { absoluteUrl } from './site'

export interface RouteSeo {
  title: string
  description: string
  path: string
  noindex?: boolean
  ogImage?: string
}

const brand = business.name
const DEFAULT_OG = '/icons/og-default.jpg'

/** Factual titles and descriptions only: no superlatives or unverified claims. */
export const routeSeo: Record<RouteKey | 'notFound', RouteSeo> = {
  home: {
    path: PATHS.home,
    title: `${brand} | Hair, Skin & Makeup in Jagatpura, Jaipur`,
    description:
      'Classy Unisex Salon in Jagatpura, Jaipur: hair treatments, skin care, and bridal, HD and airbrush makeup. Enquire on WhatsApp or visit us at Vishwa Vidhyalaya Nagar.',
  },
  about: {
    path: PATHS.about,
    title: `About Classy | Unisex Salon in Jagatpura, Jaipur`,
    description: 'About Classy Unisex Salon in Jagatpura, Jaipur: the salon, the space, our approach to hair, skin and makeup, and what to expect when you visit.',
  },
  services: {
    path: PATHS.services,
    title: 'Our Services | Classy Unisex Salon in Jagatpura, Jaipur',
    description:
      'Signature hair, skin and makeup services at Classy Unisex Salon, Jagatpura, Jaipur: keratin, hair botox, glossing, repair and scalp treatments, radiant skin care, hands & feet spa, and bridal, HD and airbrush makeup. Enquire on WhatsApp.',
    ogImage: '/icons/og-services.jpg',
  },
  gallery: {
    path: PATHS.gallery,
    title: 'Gallery | Classy Unisex Salon in Jagatpura, Jaipur',
    description: 'Bridal makeup, hair finishes, nail art and the salon interiors at Classy Unisex Salon, Jagatpura, Jaipur. Real photos and videos from the salon.',
    ogImage: '/icons/og-gallery.jpg',
  },
  reviews: {
    path: PATHS.reviews,
    title: 'Reviews | Classy Unisex Salon in Jagatpura, Jaipur',
    description: 'What clients say about Classy Unisex Salon in Jagatpura, Jaipur: our Google rating and reviews from clients, in their own words. Read every review on Google.',
  },
  contact: {
    path: PATHS.contact,
    title: 'Contact Classy | Unisex Salon in Jagatpura, Jaipur',
    description:
      'Visit Classy Unisex Salon at Plot no. 210, Vishwa Vidhyalaya Nagar, Jagatpura, Jaipur. Open every day 9:30 AM to 9:30 PM. Call, WhatsApp, email, get directions or send an appointment enquiry.',
  },
  privacy: {
    path: PATHS.privacy,
    title: 'Privacy Policy | Classy Unisex Salon',
    description: 'How the Classy Unisex Salon website handles information: appointment enquiries via WhatsApp, phone and email links, Google Maps and Instagram. No accounts, payments or tracking cookies.',
  },
  terms: {
    path: PATHS.terms,
    title: 'Terms & Conditions | Classy Unisex Salon',
    description: 'Terms for using the Classy Unisex Salon website in Jagatpura, Jaipur: appointment enquiries, service information, content and external links.',
  },
  styleguide: {
    path: PATHS.styleguide,
    title: `Foundation styleguide | ${brand}`,
    description: 'Internal design-system reference. Not part of the public site.',
    noindex: true,
  },
  notFound: {
    path: '/404',
    title: 'Page Not Found | Classy Unisex Salon',
    description: 'The page you were looking for could not be found. Explore the services at Classy Unisex Salon, Jaipur.',
    noindex: true,
  },
}

export function ogImageFor(route: RouteSeo): string {
  return absoluteUrl(route.ogImage ?? DEFAULT_OG)
}

/**
 * schema.org HairSalon JSON-LD. Only verified fields are included:
 * aggregateRating, telephone, openingHours and geo are omitted while pending.
 */
export function buildLocalBusinessJsonLd(): Record<string, unknown> {
  const address = valueOf(business.address)
  const phone = valueOf(business.phone)
  const email = valueOf(business.email)
  const hours = valueOf(business.hours)
  const rating = valueOf(business.rating)
  const geo = valueOf(business.geo)
  const sameAs = business.instagram.map((i) => valueOf(i.url)).filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': `${absoluteUrl('/')}#salon`,
    name: business.name,
    url: absoluteUrl('/'),
    image: absoluteUrl(DEFAULT_OG),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.streetAddress,
        addressLocality: `${address.locality}, ${address.city}`,
        addressRegion: address.region,
        postalCode: address.postalCode,
        addressCountry: address.country,
      },
    }),
    ...(phone && { telephone: phone }),
    ...(email && { email }),
    ...(geo && { geo: { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng } }),
    ...(hours && {
      openingHoursSpecification: hours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days,
        opens: h.opens,
        closes: h.closes,
      })),
    }),
    ...(rating && {
      aggregateRating: { '@type': 'AggregateRating', ratingValue: rating.value, reviewCount: rating.count },
    }),
    ...(valueOf(business.mapsUrl) && { hasMap: valueOf(business.mapsUrl) }),
    ...(sameAs.length > 0 && { sameAs }),
    ...(business.established && valueOf(business.established) && { foundingDate: valueOf(business.established) }),
  }
}

export interface Crumb {
  name: string
  path: string
}

/** schema.org BreadcrumbList for an inner page. */
export function buildBreadcrumbJsonLd(trail: Crumb[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absoluteUrl(c.path) })),
  }
}

/** schema.org AboutPage, linked to the salon entity from buildLocalBusinessJsonLd(). */
export function buildAboutPageJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: routeSeo.about.title,
    description: routeSeo.about.description,
    url: absoluteUrl(routeSeo.about.path),
    about: { '@id': `${absoluteUrl('/')}#salon` },
    inLanguage: 'en-IN',
  }
}

/**
 * schema.org WebPage for Our Services with an OfferCatalog of the services
 * (names only: no prices, durations or offers are published).
 */
export function buildServicesPageJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: routeSeo.services.title,
    description: routeSeo.services.description,
    url: absoluteUrl(routeSeo.services.path),
    inLanguage: 'en-IN',
    about: { '@id': `${absoluteUrl('/')}#salon` },
    mainEntity: {
      '@type': 'OfferCatalog',
      name: 'Services at Classy Unisex Salon',
      itemListElement: serviceGroups.map((g) => ({
        '@type': 'OfferCatalog',
        name: g.title,
        itemListElement: g.items.map((item) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: displayLabel(item), provider: { '@id': `${absoluteUrl('/')}#salon` }, areaServed: 'Jaipur' },
        })),
      })),
    },
  }
}

/** schema.org CollectionPage for the Gallery with its photos and videos (real Classy media only). */
export function buildGalleryPageJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: routeSeo.gallery.title,
    description: routeSeo.gallery.description,
    url: absoluteUrl(routeSeo.gallery.path),
    inLanguage: 'en-IN',
    about: { '@id': `${absoluteUrl('/')}#salon` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: galleryItems.length,
      itemListElement: orderedGalleryItems.map((item, i) => {
        const own = isOwnMedia(item) && { contentLocation: { '@type': 'Place', name: business.name } }
        return {
          '@type': 'ListItem',
          position: i + 1,
          item: item.kind === 'image'
            ? { '@type': 'ImageObject', contentUrl: absoluteUrl(item.src), thumbnailUrl: absoluteUrl(item.thumb), caption: item.alt, ...own }
            : { '@type': 'VideoObject', contentUrl: absoluteUrl(item.src), thumbnailUrl: absoluteUrl(item.thumb), name: item.alt, description: item.alt, ...own },
        }
      }),
    },
  }
}

/**
 * schema.org WebPage for Reviews. No Review/AggregateRating markup here:
 * the verified aggregate rating is already part of the salon entity
 * (buildLocalBusinessJsonLd), and individual reviews are not marked up.
 */
export function buildReviewsPageJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: routeSeo.reviews.title,
    description: routeSeo.reviews.description,
    url: absoluteUrl(routeSeo.reviews.path),
    inLanguage: 'en-IN',
    about: { '@id': `${absoluteUrl('/')}#salon` },
  }
}

/** schema.org ContactPage linked to the salon entity (contact facts live on the salon entity itself). */
export function buildContactPageJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: routeSeo.contact.title,
    description: routeSeo.contact.description,
    url: absoluteUrl(routeSeo.contact.path),
    inLanguage: 'en-IN',
    about: { '@id': `${absoluteUrl('/')}#salon` },
  }
}
