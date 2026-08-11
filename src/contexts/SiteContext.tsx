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

      // Si Firestore aún tiene el contenido demo anterior, usar el seed oficial.
      const legacyContent =
        !siteData.address?.includes('Suipacha') ||
        servicesData.some(
          (s) => s.slug === 'emergencias' || s.slug === 'consulta-clinica',
        )

      if (legacyContent) {
        setSite(seedSite)
        setHero(seedHero)
        setServices(seedServices.filter((s) => s.active !== false))
        setTeam(seedTeam.filter((t) => t.active !== false))
        setGallery(seedGallery)
        setBlog(seedBlog.filter((b) => b.published !== false))
        setFaqs(seedFaqs.filter((f) => f.active !== false))
        setTestimonials(seedTestimonials.filter((t) => t.active !== false))
        setHours(seedHours)
      } else {
        setSite(siteData)
        setHero(heroData)
        setServices(servicesData.filter((s) => s.active !== false))
        setTeam(teamData.filter((t) => t.active !== false))
        setGallery(galleryData)
        setBlog(blogData.filter((b) => b.published !== false))
        setFaqs(faqsData.filter((f) => f.active !== false))
        setTestimonials(testimonialsData.filter((t) => t.active !== false))
        setHours(hoursData)
      }
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
