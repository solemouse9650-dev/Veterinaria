export type ReservationStatus =
  | 'pendiente'
  | 'confirmada'
  | 'completada'
  | 'cancelada'

export interface SiteInfo {
  name: string
  tagline: string
  description: string
  phone: string
  email: string
  whatsapp: string
  address: string
  city: string
  province: string
  postalCode: string
  mapEmbedUrl: string
  mapLat: number
  mapLng: number
  social: {
    facebook: string
    instagram: string
    youtube: string
    tiktok: string
  }
  yearsExperience: number
  patientsServed: number
  mission: string
  history: string
  values: { title: string; description: string }[]
  commitment: string
}

export interface HeroContent {
  title: string
  subtitle: string
  image: string
  ctaPrimary: string
  ctaSecondary: string
  ctaTertiary: string
  stats: { label: string; value: string }[]
}

export interface Service {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  duration: number
  image: string
  category: string
  active: boolean
  featured: boolean
  order: number
}

export interface TeamMember {
  id: string
  name: string
  specialty: string
  description: string
  experience: string
  image: string
  schedule: string
  active: boolean
  order: number
  areas?: string[]
}

export interface GalleryItem {
  id: string
  title: string
  image: string
  type: 'image' | 'video'
  category: string
  order: number
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  category: string
  author: string
  published: boolean
  publishedAt: string
  createdAt: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  order: number
  active: boolean
}

export interface Testimonial {
  id: string
  name: string
  petName: string
  rating: number
  comment: string
  image: string
  active: boolean
  order: number
}

export interface DayHours {
  day: string
  open: string
  close: string
  closed: boolean
}

export interface HoursConfig {
  id: string
  regular: DayHours[]
  holidays: { date: string; name: string; closed: boolean }[]
  vacations: { start: string; end: string; note: string }[]
  emergencyNote: string
}

export interface Reservation {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  petName: string
  species: string
  breed: string
  age: string
  weight: string
  serviceId: string
  serviceName: string
  date: string
  time: string
  veterinarianId: string
  veterinarianName: string
  notes: string
  status: ReservationStatus
  createdAt: string
  updatedAt: string
  estimatedPrice: number
}

export interface Specialty {
  id: string
  name: string
  description: string
  image: string
  features: string[]
}

export interface ActivityLog {
  id: string
  action: string
  detail: string
  createdAt: string
}
