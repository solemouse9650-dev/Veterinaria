import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  type DocumentData,
  type Firestore,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { sanitizeHtml } from '@/lib/sanitize'
import type {
  ActivityLog,
  BlogPost,
  FAQ,
  GalleryItem,
  HeroContent,
  HoursConfig,
  Reservation,
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
  team as seedTeam,
  testimonials as seedTestimonials,
} from '@/data/seed'

function requireDb(): Firestore {
  if (!db) {
    throw new Error(
      'El servicio no está disponible. Escribinos por WhatsApp.',
    )
  }
  return db
}

async function getCollectionOrdered<T>(
  name: string,
  orderField = 'order',
): Promise<T[]> {
  if (!db) return []
  try {
    const q = query(collection(requireDb(), name), orderBy(orderField, 'asc'))
    const snap = await getDocs(q)
    if (snap.empty) return []
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
  } catch {
    const snap = await getDocs(collection(requireDb(), name))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
  }
}

export async function fetchSiteInfo(): Promise<SiteInfo> {
  if (!db) return seedSite
  const snap = await getDoc(doc(requireDb(), 'site', 'info'))
  return snap.exists() ? (snap.data() as SiteInfo) : seedSite
}

export async function fetchHero(): Promise<HeroContent> {
  if (!db) return seedHero
  const snap = await getDoc(doc(requireDb(), 'site', 'hero'))
  return snap.exists() ? (snap.data() as HeroContent) : seedHero
}

export async function fetchServices(): Promise<Service[]> {
  const data = await getCollectionOrdered<Service>('services')
  return data.length ? data : seedServices
}

export async function fetchTeam(): Promise<TeamMember[]> {
  const data = await getCollectionOrdered<TeamMember>('team')
  return data.length ? data : seedTeam
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  const data = await getCollectionOrdered<GalleryItem>('gallery')
  return data.length ? data : seedGallery
}

const WRITABLE_COLLECTIONS = new Set([
  'services',
  'team',
  'gallery',
  'blog',
  'faqs',
  'testimonials',
  'site',
  'hours',
  'clients',
  'reservations',
  'activity',
])

function assertWritableCollection(name: string) {
  if (!WRITABLE_COLLECTIONS.has(name)) {
    throw new Error('Colección no permitida.')
  }
}

export async function fetchBlog(): Promise<BlogPost[]> {
  if (!db) {
    return seedBlog.map((post) => ({
      ...post,
      content: sanitizeHtml(post.content),
    }))
  }
  try {
    const snap = await getDocs(collection(requireDb(), 'blog'))
    const data = snap.docs.map((d) => {
      const post = { id: d.id, ...d.data() } as BlogPost
      return { ...post, content: sanitizeHtml(post.content) }
    })
    if (!data.length) {
      return seedBlog.map((post) => ({
        ...post,
        content: sanitizeHtml(post.content),
      }))
    }
    return data.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
  } catch {
    return seedBlog.map((post) => ({ ...post, content: sanitizeHtml(post.content) }))
  }
}

export async function fetchFaqs(): Promise<FAQ[]> {
  const data = await getCollectionOrdered<FAQ>('faqs')
  return data.length ? data : seedFaqs
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const data = await getCollectionOrdered<Testimonial>('testimonials')
  return data.length ? data : seedTestimonials
}

export async function fetchHours(): Promise<HoursConfig> {
  if (!db) return seedHours
  const snap = await getDoc(doc(requireDb(), 'hours', 'main'))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as HoursConfig) : seedHours
}

export async function fetchReservations(): Promise<Reservation[]> {
  if (!db) return []
  const snap = await getDocs(collection(requireDb(), 'reservations'))
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Reservation)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
}

export async function createReservation(
  data: Omit<Reservation, 'id'>,
): Promise<string> {
  if (!db) {
    throw new Error(
      'No se pudo enviar la reserva. Escribinos por WhatsApp para coordinar el turno.',
    )
  }
  const ref = await addDoc(collection(requireDb(), 'reservations'), data)
  return ref.id
}

export async function updateReservation(
  id: string,
  data: Partial<Reservation>,
) {
  await updateDoc(doc(requireDb(), 'reservations', id), data as DocumentData)
}

export async function deleteReservation(id: string) {
  await deleteDoc(doc(requireDb(), 'reservations', id))
}

export async function saveDoc(
  collectionName: string,
  id: string,
  data: DocumentData,
) {
  assertWritableCollection(collectionName)
  await setDoc(doc(requireDb(), collectionName, id), data, { merge: true })
}

export async function createDoc(collectionName: string, data: DocumentData) {
  assertWritableCollection(collectionName)
  const ref = await addDoc(collection(requireDb(), collectionName), data)
  return ref.id
}

export async function removeDoc(collectionName: string, id: string) {
  assertWritableCollection(collectionName)
  await deleteDoc(doc(requireDb(), collectionName, id))
}

export async function logActivity(action: string, detail: string) {
  const payload: Omit<ActivityLog, 'id'> = {
    action,
    detail,
    createdAt: new Date().toISOString(),
  }
  await addDoc(collection(requireDb(), 'activity'), payload)
}

export async function fetchActivity(): Promise<ActivityLog[]> {
  const snap = await getDocs(collection(requireDb(), 'activity'))
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as ActivityLog)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 12)
}

async function clearCollection(name: string) {
  const snap = await getDocs(collection(requireDb(), name))
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
}

export async function seedDatabase() {
  await Promise.all([
    clearCollection('services'),
    clearCollection('team'),
    clearCollection('gallery'),
    clearCollection('blog'),
    clearCollection('faqs'),
    clearCollection('testimonials'),
  ])

  await setDoc(doc(requireDb(), 'site', 'info'), seedSite)
  await setDoc(doc(requireDb(), 'site', 'hero'), seedHero)
  await setDoc(doc(requireDb(), 'hours', 'main'), {
    regular: seedHours.regular,
    holidays: seedHours.holidays,
    vacations: seedHours.vacations,
    emergencyNote: seedHours.emergencyNote,
  })

  for (const item of seedServices) {
    const { id, ...rest } = item
    await setDoc(doc(requireDb(), 'services', id), rest)
  }
  for (const item of seedTeam) {
    const { id, ...rest } = item
    await setDoc(doc(requireDb(), 'team', id), rest)
  }
  for (const item of seedGallery) {
    const { id, ...rest } = item
    await setDoc(doc(requireDb(), 'gallery', id), rest)
  }
  for (const item of seedBlog) {
    const { id, ...rest } = item
    await setDoc(doc(requireDb(), 'blog', id), rest)
  }
  for (const item of seedFaqs) {
    const { id, ...rest } = item
    await setDoc(doc(requireDb(), 'faqs', id), rest)
  }
  for (const item of seedTestimonials) {
    const { id, ...rest } = item
    await setDoc(doc(requireDb(), 'testimonials', id), rest)
  }

  await logActivity('seed', 'Contenido oficial de EcoVet cargado en Firestore')
}
