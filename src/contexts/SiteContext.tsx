import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  BlogPost,
  FAQ,
  GalleryItem,
  HeroContent,
  HoursConfig,
  Service,
  SiteInfo,
  TeamMember,
  Testimonial,
} from '@/types'
import {
  blogPosts as seedBlog,
  faqs as seedFaqs,
  gallery as seedGallery,
  heroContent as seedHero,
  hoursConfig as seedHours,
  services as seedServices,
  siteInfo as seedSite,
  specialties,
  team as seedTeam,
  testimonials as seedTestimonials,
} from '@/data/seed'
import { isStockMediaUrl, TEAM_PHOTOS } from '@/data/media'
import { normalizeHours } from '@/lib/hours'
import {
  fetchBlog,
  fetchFaqs,
  fetchGallery,
  fetchHero,
  fetchHours,
  fetchServices,
  fetchSiteInfo,
  fetchTeam,
  fetchTestimonials,
} from '@/services/firestore'

interface SiteContextValue {
  loading: boolean
  site: SiteInfo
  hero: HeroContent
  services: Service[]
  team: TeamMember[]
  gallery: GalleryItem[]
  blog: BlogPost[]
  faqs: FAQ[]
  testimonials: Testimonial[]
  hours: HoursConfig
  specialties: typeof specialties
  refresh: () => Promise<void>
}

const SiteContext = createContext<SiteContextValue | null>(null)

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '')
}

function withLocalTeamPhotos(members: TeamMember[]): TeamMember[] {
  return members.map((member) => {
    const seed = seedTeam.find(
      (item) =>
        item.id === member.id ||
        normalizeName(item.name).includes(normalizeName(member.name)) ||
        normalizeName(member.name).includes(normalizeName(item.name)),
    )
    const name = normalizeName(member.name)
    const photoFromName = name.includes('claudia')
      ? TEAM_PHOTOS.claudia
      : name.includes('martin') || name.includes('zuchino')
        ? TEAM_PHOTOS.martin
        : name.includes('alejandro') || name.includes('gimenez')
          ? TEAM_PHOTOS.alejandro
          : ''
    const image = isStockMediaUrl(member.image)
      ? seed?.image || photoFromName || member.image
      : member.image
    const areas =
      member.areas && member.areas.length > 0 ? member.areas : seed?.areas
    return { ...member, image, ...(areas ? { areas } : {}) }
  })
}

function withLocalServiceImages(items: Service[]): Service[] {
  return items.map((service) => {
    const seed = seedServices.find(
      (item) => item.id === service.id || item.slug === service.slug,
    )
    if (
      seed &&
      isStockMediaUrl(service.image) &&
      !isStockMediaUrl(seed.image)
    ) {
      return { ...service, image: seed.image }
    }
    return service
  })
}

function withLocalGallery(items: GalleryItem[]): GalleryItem[] {
  const source =
    !items.length || items.every((item) => isStockMediaUrl(item.image))
      ? seedGallery
      : items
  return source.map((item) => {
    const category = /actividad/i.test(item.category)
      ? 'Pacientes'
      : item.category
    const title = /actividad/i.test(item.title) ? 'Pacientes' : item.title
    return { ...item, category, title }
  })
}

function withLocalBlogImages(items: BlogPost[]): BlogPost[] {
  return items.map((post) => {
    const seed = seedBlog.find(
      (item) => item.id === post.id || item.slug === post.slug,
    )
    if (
      seed &&
      isStockMediaUrl(post.image) &&
      !isStockMediaUrl(seed.image)
    ) {
      return { ...post, image: seed.image }
    }
    return post
  })
}

function withLocalHero(hero: HeroContent): HeroContent {
  if (isStockMediaUrl(hero.image)) {
    return { ...hero, image: seedHero.image }
  }
  return hero
}

function withOfficialSocial(site: SiteInfo): SiteInfo {
  const facebook = site.social.facebook || ''
  const outdated =
    !facebook || /facebook\.com\/ecovetclinic/i.test(facebook)
  return {
    ...site,
    social: {
      facebook: outdated ? seedSite.social.facebook : facebook,
      instagram: seedSite.social.instagram,
    },
  }
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [site, setSite] = useState<SiteInfo>(seedSite)
  const [hero, setHero] = useState<HeroContent>(seedHero)
  const [services, setServices] = useState<Service[]>(seedServices)
  const [team, setTeam] = useState<TeamMember[]>(seedTeam)
  const [gallery, setGallery] = useState<GalleryItem[]>(seedGallery)
  const [blog, setBlog] = useState<BlogPost[]>(seedBlog)
  const [faqs, setFaqs] = useState<FAQ[]>(seedFaqs)
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(seedTestimonials)
  const [hours, setHours] = useState<HoursConfig>(seedHours)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [
        siteData,
        heroData,
        servicesData,
        teamData,
        galleryData,
        blogData,
        faqsData,
        testimonialsData,
        hoursData,
      ] = await Promise.all([
        fetchSiteInfo(),
        fetchHero(),
        fetchServices(),
        fetchTeam(),
        fetchGallery(),
        fetchBlog(),
        fetchFaqs(),
        fetchTestimonials(),
        fetchHours(),
      ])

      const isDomicilio = (s: { slug?: string; name?: string }) => {
        const slug = (s.slug || '').toLowerCase()
        const name = (s.name || '').toLowerCase()
        return (
          slug === 'domicilios' ||
          slug.includes('domicilio') ||
          name.includes('domicilio')
        )
      }

      setSite(withOfficialSocial(siteData))
      setHero(withLocalHero(heroData))
      setServices(
        withLocalServiceImages(
          servicesData.filter((s) => s.active !== false && !isDomicilio(s)),
        ),
      )
      setTeam(withLocalTeamPhotos(teamData.filter((t) => t.active !== false)))
      setGallery(withLocalGallery(galleryData))
      setBlog(
        withLocalBlogImages(blogData.filter((b) => b.published !== false)),
      )
      setFaqs(faqsData.filter((f) => f.active !== false))
      setTestimonials(testimonialsData.filter((t) => t.active !== false))
      setHours(normalizeHours(hoursData))
    } catch {
      // Keep seed fallbacks when Firestore is unreachable.
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo(
    () => ({
      loading,
      site,
      hero,
      services,
      team,
      gallery,
      blog,
      faqs,
      testimonials,
      hours,
      specialties,
      refresh,
    }),
    [
      loading,
      site,
      hero,
      services,
      team,
      gallery,
      blog,
      faqs,
      testimonials,
      hours,
      refresh,
    ],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite debe usarse dentro de SiteProvider')
  return ctx
}
