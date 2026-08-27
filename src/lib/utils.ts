import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Normaliza teléfonos AR/locales para wa.me */
export function normalizePhone(phone: string) {
  let clean = phone.replace(/\D/g, '')
  if (!clean) return ''
  if (clean.startsWith('54')) return clean
  if (clean.startsWith('0')) clean = clean.slice(1)
  if (clean.startsWith('15') && clean.length >= 10) {
    clean = clean.slice(2)
  }
  // Celulares AR suelen quedar en 10 dígitos (ej. 11xxxxxxxx)
  if (clean.length === 10) return `549${clean}`
  if (clean.length === 8 || clean.length === 9) return `54911${clean}`
  return clean
}

export function whatsappUrl(phone: string, message?: string) {
  const clean = normalizePhone(phone)
  const text = encodeURIComponent(
    message ||
      'Hola EcoVet, me gustaría consultar sobre los servicios para mi mascota.',
  )
  return `https://wa.me/${clean}?text=${text}`
}

export function reservationConfirmMessage(r: {
  firstName: string
  lastName: string
  petName: string
  serviceName: string
  date: string
  time: string
  veterinarianName: string
}) {
  return [
    `Hola ${r.firstName} ${r.lastName} 👋`,
    '',
    'Te confirmamos tu turno en EcoVet Clínica Veterinaria:',
    `• Mascota: ${r.petName}`,
    `• Servicio: ${r.serviceName}`,
    `• Fecha: ${r.date}`,
    `• Hora: ${r.time}`,
    `• Veterinario/a: ${r.veterinarianName}`,
    '',
    'Si necesitás reprogramar, respondé este mensaje. ¡Te esperamos!',
  ].join('\n')
}

export function truncate(text: string, length = 120) {
  if (text.length <= length) return text
  return `${text.slice(0, length).trim()}…`
}

export function blogCoverAlt(title: string) {
  const value = title.toLowerCase()
  if (value.includes('gato') || value.includes('felin')) {
    return 'Paciente felino atendido en EcoVet Clínica Veterinaria'
  }
  if (value.includes('cachorro') || value.includes('perro') || value.includes('canin')) {
    return 'Paciente canino atendido en EcoVet Clínica Veterinaria'
  }
  if (value.includes('vacun')) {
    return 'Atención preventiva en EcoVet Clínica Veterinaria'
  }
  if (value.includes('tenencia') || value.includes('responsable')) {
    return 'Equipo de EcoVet Clínica Veterinaria'
  }
  return 'Imagen de EcoVet Clínica Veterinaria'
}
