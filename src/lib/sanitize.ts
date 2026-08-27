/** Limpia texto de entrada pública antes de persistir (mitiga XSS / payloads raros). */
export function sanitizeText(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength)
}

export function sanitizeEmail(value: unknown): string {
  return sanitizeText(value, 120).toLowerCase()
}

export function sanitizePhone(value: unknown): string {
  return sanitizeText(value, 40).replace(/[^\d+\-\s()]/g, '')
}
