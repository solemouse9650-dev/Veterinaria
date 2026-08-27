import { Helmet } from 'react-helmet-async'
import { useSite } from '@/contexts/SiteContext'
import { encodeJsonForScript, sanitizeHttpUrl } from '@/lib/sanitize'

export function SchemaOrg() {
  const { site, hours } = useSite()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VeterinaryCare',
    name: site.name,
    description: site.description,
    url: 'https://ecovet.clinic',
    telephone: site.phone,
    email: site.email,
    image: 'https://ecovet.clinic/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address,
      addressLocality: site.city,
      addressRegion: site.province,
      postalCode: site.postalCode,
      addressCountry: 'AR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.mapLat,
      longitude: site.mapLng,
    },
    openingHoursSpecification: hours.regular
      .filter((d) => !d.closed)
      .map((d) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: d.day,
        opens: d.open,
        closes: d.close,
      })),
    sameAs: [site.social.facebook, site.social.instagram]
      .map((url) => sanitizeHttpUrl(url))
      .filter(Boolean),
    priceRange: '$$',
  }

  return (
    <Helmet>
      <script type="application/ld+json">{encodeJsonForScript(schema)}</script>
    </Helmet>
  )
}
