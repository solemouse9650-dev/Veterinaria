import type { ContactMessage, TelemedicineRequest } from '@/types'

export const TELEMEDICINE_FALLBACK_PREFIX = '[EcoVet Telemedicina]'

type Meta = {
  nativeId?: string
  country: string
  city: string
  countryCode: string
  whatsapp: string
  petName: string
  species: string
  breed: string
  age: string
  sex: string
  consultationReason: string
  durationNote: string
  additionalInformation?: string
}

export function isTelemedicineFallbackMessage(message: string) {
  return (message || '').startsWith(TELEMEDICINE_FALLBACK_PREFIX)
}

export function encodeTelemedicineFallback(
  data: Omit<TelemedicineRequest, 'id' | 'storage'> & { nativeId?: string },
) {
  const meta: Meta = {
    nativeId: data.nativeId,
    country: data.country,
    city: data.city,
    countryCode: data.countryCode,
    whatsapp: data.whatsapp,
    petName: data.petName,
    species: data.species,
    breed: data.breed,
    age: data.age,
    sex: data.sex,
    consultationReason: data.consultationReason,
    durationNote: data.durationNote,
    additionalInformation: (data.additionalInformation || '').slice(0, 180),
  }
  const json = JSON.stringify(meta)
  const head = `${TELEMEDICINE_FALLBACK_PREFIX}${json}\n`
  const body = (data.description || '').slice(0, Math.max(0, 2000 - head.length))
  return `${head}${body}`
}

export function parseTelemedicineFallback(
  doc: ContactMessage,
): TelemedicineRequest | null {
  if (!isTelemedicineFallbackMessage(doc.message)) return null
  const raw = doc.message.slice(TELEMEDICINE_FALLBACK_PREFIX.length)
  const split = raw.indexOf('\n')
  const metaText = (split === -1 ? raw : raw.slice(0, split)).trim()
  const description = split === -1 ? '' : raw.slice(split + 1)
  let meta: Meta
  try {
    meta = JSON.parse(metaText) as Meta
  } catch {
    return null
  }
  const rawStatus = doc.status || 'pendiente'
  const status = (
    ['pendiente', 'contactado', 'coordinando', 'confirmado', 'realizado', 'cancelado'] as const
  ).includes(rawStatus as TelemedicineRequest['status'])
    ? (rawStatus as TelemedicineRequest['status'])
    : 'pendiente'
  return {
    id: doc.id,
    ownerName: doc.name,
    country: meta.country || '',
    city: meta.city || '',
    countryCode: meta.countryCode || '',
    phone: doc.phone,
    whatsapp: meta.whatsapp || doc.phone,
    email: doc.email,
    petName: meta.petName || '',
    species: meta.species || '',
    breed: meta.breed || '',
    age: meta.age || '',
    sex: meta.sex || '',
    consultationReason: meta.consultationReason || '',
    description,
    durationNote: meta.durationNote || '',
    additionalInformation: meta.additionalInformation || '',
    status,
    createdAt: doc.createdAt,
    updatedAt: doc.createdAt,
    termsAccepted: true,
    contactConsent: true,
    adminNotes: doc.adminNotes,
    contactedAt: doc.contactedAt,
    scheduledAt: doc.scheduledAt,
    consultationMethod: doc.consultationMethod,
    storage: 'clients',
    nativeId: meta.nativeId,
  }
}
