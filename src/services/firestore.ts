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

async function getCollectionOrdered<T>(
  name: string,
  orderField = 'order',
): Promise<T[]> {
  try {
    const q = query(collection(db, name), orderBy(orderField, 'asc'))
    const snap = await getDocs(q)
    if (snap.empty) return []
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
  } catch {
    const snap = await getDocs(collection(db, name))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
  }
}

export async function fetchSiteInfo(): Promise<SiteInfo> {
  const snap = await getDoc(doc(db, 'site', 'info'))
  return snap.exists() ? (snap.data() as SiteInfo) : seedSite
}

export async function fetchHero(): Promise<HeroContent> {
  const snap = await getDoc(doc(db, 'site', 'hero'))
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
  try {
    const snap = await getDocs(collection(db, 'blog'))
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
  const snap = await getDoc(doc(db, 'hours', 'main'))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as HoursConfig) : seedHours
}

export async function fetchReservations(): Promise<Reservation[]> {
  const snap = await getDocs(collection(db, 'reservations'))
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
  const ref = await addDoc(collection(db, 'reservations'), data)
  return ref.id
}

export async function updateReservation(
  id: string,
  data: Partial<Reservation>,
) {
  await updateDoc(doc(db, 'reservations', id), data as DocumentData)
}

export async function deleteReservation(id: string) {
  await deleteDoc(doc(db, 'reservations', id))
}

export async function saveDoc(
  collectionName: string,
  id: string,
  data: DocumentData,
) {
  assertWritableCollection(collectionName)
  await setDoc(doc(db, collectionName, id), data, { merge: true })
}

export async function createDoc(collectionName: string, data: DocumentData) {
  assertWritableCollection(collectionName)
  const ref = await addDoc(collection(db, collectionName), data)
  return ref.id
}

export async function removeDoc(collectionName: string, id: string) {
  assertWritableCollection(collectionName)
  await deleteDoc(doc(db, collectionName, id))
}

export async function logActivity(action: string, detail: string) {
  const payload: Omit<ActivityLog, 'id'> = {
    action,
    detail,
    createdAt: new Date().toISOString(),
  }
  await addDoc(collection(db, 'activity'), payload)
}

export async function fetchActivity(): Promise<ActivityLog[]> {
  const snap = await getDocs(collection(db, 'activity'))
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as ActivityLog)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 12)
}

async function clearCollection(name: string) {
  const snap = await getDocs(collection(db, name))
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

  await setDoc(doc(db, 'site', 'info'), seedSite)
  await setDoc(doc(db, 'site', 'hero'), seedHero)
  await setDoc(doc(db, 'hours', 'main'), {
    regular: seedHours.regular,
    holidays: seedHours.holidays,
    vacations: seedHours.vacations,
    emergencyNote: seedHours.emergencyNote,
  })

  for (const item of seedServices) {
    const { id, ...rest } = item
    await setDoc(doc(db, 'services', id), rest)
  }
  for (const item of seedTeam) {
    const { id, ...rest } = item
    await setDoc(doc(db, 'team', id), rest)
  }
  for (const item of seedGallery) {
    const { id, ...rest } = item
    await setDoc(doc(db, 'gallery', id), rest)
  }
  for (const item of seedBlog) {
    const { id, ...rest } = item
    await setDoc(doc(db, 'blog', id), rest)
  }
  for (const item of seedFaqs) {
    const { id, ...rest } = item
    await setDoc(doc(db, 'faqs', id), rest)
  }
  for (const item of seedTestimonials) {
    const { id, ...rest } = item
    await setDoc(doc(db, 'testimonials', id), rest)
  }

  await logActivity('seed', 'Contenido oficial de EcoVet cargado en Firestore')
}
