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
    youtube?: string
    tiktok?: string
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

export type OpenStatusOverride = 'auto' | 'open' | 'closed'

export interface HoursConfig {
  id: string
  regular: DayHours[]
  holidays: { date: string; name: string; closed: boolean }[]
  vacations: { start: string; end: string; note: string }[]
  emergencyNote: string
  /** auto = según horario/feriados. open/closed fuerza el indicador público. */
  statusOverride: OpenStatusOverride
  statusNote: string
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

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  message: string
  type: 'contact'
  createdAt: string
  read?: boolean
  status?: string
  adminNotes?: string
  contactedAt?: string
  scheduledAt?: string
  consultationMethod?: string
}

export interface ActivityLog {
  id: string
  action: string
  detail: string
  createdAt: string
}

export type TelemedicineStatus =
  | 'pendiente'
  | 'contactado'
  | 'coordinando'
  | 'confirmado'
  | 'realizado'
  | 'cancelado'

export interface TelemedicineRequest {
  id: string
  ownerName: string
  country: string
  city: string
  countryCode: string
  phone: string
  whatsapp: string
  email: string
  petName: string
  species: string
  breed: string
  age: string
  sex: string
  consultationReason: string
  description: string
  durationNote: string
  additionalInformation: string
  status: TelemedicineStatus
  createdAt: string
  updatedAt: string
  termsAccepted: boolean
  contactConsent: boolean
  adminNotes?: string
  contactedAt?: string
  scheduledAt?: string
  consultationMethod?: string
  storage?: 'telemedicine_requests' | 'clients'
  nativeId?: string
}
