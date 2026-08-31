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
import {
  encodeTelemedicineFallback,
  isTelemedicineFallbackMessage,
  parseTelemedicineFallback,
} from '@/lib/telemedicineFallback'
import type {
  ActivityLog,
  BlogPost,
  ContactMessage,
  FAQ,
  GalleryItem,
  HeroContent,
  HoursConfig,
  Reservation,
  Service,
  SiteInfo,
  TeamMember,
  TelemedicineRequest,
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
import { normalizeHours } from '@/lib/hours'

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
  'telemedicine_requests',
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
  if (!snap.exists()) return seedHours
  return normalizeHours({ id: snap.id, ...snap.data() } as HoursConfig)
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

const TELEMEDICINE_ADMIN_FIELDS = new Set([
  'status',
  'adminNotes',
  'contactedAt',
  'scheduledAt',
  'consultationMethod',
  'updatedAt',
])

export async function createTelemedicineRequest(
  data: Omit<
    TelemedicineRequest,
    | 'id'
    | 'adminNotes'
    | 'contactedAt'
    | 'scheduledAt'
    | 'consultationMethod'
    | 'storage'
  >,
): Promise<string> {
  if (!db) {
    throw new Error(
      'No se pudo enviar la solicitud. Escribinos por WhatsApp para coordinar la consulta.',
    )
  }
  try {
    const ref = await addDoc(
      collection(requireDb(), 'telemedicine_requests'),
      data as DocumentData,
    )
    return ref.id
  } catch (error) {
    const code =
      typeof error === 'object' && error && 'code' in error
        ? String((error as { code: string }).code)
        : ''
    if (code !== 'permission-denied') throw error
    const ref = await addDoc(collection(requireDb(), 'clients'), {
      name: data.ownerName,
      email: data.email,
      phone: data.phone,
      message: encodeTelemedicineFallback(data),
      type: 'contact',
      createdAt: data.createdAt,
    })
    return ref.id
  }
}

export async function fetchTelemedicineRequests(): Promise<TelemedicineRequest[]> {
  if (!db) return []
  const native: TelemedicineRequest[] = []
  try {
    const snap = await getDocs(collection(requireDb(), 'telemedicine_requests'))
    native.push(
      ...snap.docs.map(
        (d) =>
          ({
            id: d.id,
            ...d.data(),
            storage: 'telemedicine_requests',
          }) as TelemedicineRequest,
      ),
    )
  } catch {
    // Rules may still omit this collection; inbox uses the contact fallback.
  }

  const fallbacks = (await fetchContactMessages(true))
    .map((item) => parseTelemedicineFallback(item))
    .filter((item): item is TelemedicineRequest => Boolean(item))

  const seen = new Set(native.map((item) => item.id))
  return [...native, ...fallbacks.filter((item) => !seen.has(item.id))].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function updateTelemedicineRequest(
  id: string,
  data: Partial<
    Pick<
      TelemedicineRequest,
      | 'status'
      | 'adminNotes'
      | 'contactedAt'
      | 'scheduledAt'
      | 'consultationMethod'
      | 'updatedAt'
    >
  >,
) {
  const clean: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (TELEMEDICINE_ADMIN_FIELDS.has(key) && value !== undefined) {
      clean[key] = value
    }
  }
  if (!Object.keys(clean).length) return
  try {
    await updateDoc(doc(requireDb(), 'telemedicine_requests', id), clean)
  } catch (error) {
    const code =
      typeof error === 'object' && error && 'code' in error
        ? String((error as { code: string }).code)
        : ''
    if (code !== 'permission-denied' && code !== 'not-found') throw error
    await updateDoc(doc(requireDb(), 'clients', id), clean)
  }
}

export async function fetchContactMessages(
  includeTelemedicine = false,
): Promise<ContactMessage[]> {
  if (!db) return []
  const snap = await getDocs(collection(requireDb(), 'clients'))
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as ContactMessage)
    .filter((item) => {
      if (item.type !== 'contact') return false
      if (includeTelemedicine) return true
      return !isTelemedicineFallbackMessage(item.message || '')
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
}

export async function updateContactMessage(
  id: string,
  data: Pick<ContactMessage, 'read'>,
) {
  await updateDoc(doc(requireDb(), 'clients', id), {
    read: data.read === true,
  })
}

export async function deleteContactMessage(id: string) {
  await deleteDoc(doc(requireDb(), 'clients', id))
}

function omitUndefined(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(omitUndefined)
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (nested !== undefined) out[key] = omitUndefined(nested)
    }
    return out
  }
  return value
}

export async function saveDoc(
  collectionName: string,
  id: string,
  data: DocumentData,
) {
  assertWritableCollection(collectionName)
  await setDoc(
    doc(requireDb(), collectionName, id),
    omitUndefined(data) as DocumentData,
    { merge: true },
  )
}

export async function createDoc(collectionName: string, data: DocumentData) {
  assertWritableCollection(collectionName)
  const ref = await addDoc(
    collection(requireDb(), collectionName),
    omitUndefined(data) as DocumentData,
  )
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
