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

export function whatsappUrl(phone: string, message?: string) {
  const clean = phone.replace(/\D/g, '')
  const text = encodeURIComponent(
    message ||
      'Hola EcoVet, me gustaría consultar sobre los servicios para mi mascota.',
  )
  return `https://wa.me/${clean}?text=${text}`
}

export function truncate(text: string, length = 120) {
  if (text.length <= length) return text
  return `${text.slice(0, length).trim()}…`
}
