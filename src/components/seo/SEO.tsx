import { Helmet } from 'react-helmet-async'
import { useSite } from '@/contexts/SiteContext'

interface SEOProps {
  title?: string
  absoluteTitle?: string
  description?: string
  path?: string
  image?: string
  type?: string
}

export function SEO({
  title,
  absoluteTitle,
  description,
  path = '/',
  image,
  type = 'website',
}: SEOProps) {
  const { site, hero } = useSite()
  const fullTitle = absoluteTitle
    ? absoluteTitle
    : title
      ? `${title} | ${site.name}`
      : `${site.name} | ${site.tagline}`
  const desc = description || site.description
  const url = `https://ecovet.clinic${path}`
  const ogImage = image || hero.image

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="es_AR" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
