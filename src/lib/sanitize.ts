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
  const email = sanitizeText(value, 120).toLowerCase()
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) return ''
  return email
}

export function sanitizePhone(value: unknown): string {
  return sanitizeText(value, 40).replace(/[^\d+\-\s()]/g, '')
}

const ALLOWED_URL_HOSTS = new Set([
  'wa.me',
  'api.whatsapp.com',
  'www.instagram.com',
  'instagram.com',
  'www.facebook.com',
  'facebook.com',
  'www.youtube.com',
  'youtube.com',
  'youtu.be',
  'www.tiktok.com',
  'tiktok.com',
  'www.google.com',
  'maps.google.com',
  'firebasestorage.googleapis.com',
  'images.unsplash.com',
])

function isAllowedHost(hostname: string) {
  const host = hostname.toLowerCase()
  if (ALLOWED_URL_HOSTS.has(host)) return true
  if (host.endsWith('.google.com')) return true
  if (host.endsWith('.firebasestorage.app')) return true
  if (host.endsWith('.googleapis.com')) return true
  return false
}

/** Solo http(s) hacia orígenes esperados. Rechaza javascript:, data:, etc. */
export function sanitizeHttpUrl(value: unknown): string {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed || trimmed.startsWith('/')) {
    if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.includes('\\')) {
      return trimmed.slice(0, 500)
    }
    if (!trimmed) return ''
  }
  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return ''
    if (url.username || url.password) return ''
    if (!isAllowedHost(url.hostname)) {
      if (url.protocol === 'https:' && trimmed.startsWith('https://')) {
        // Enlaces sociales cargados desde el panel: solo https explícito.
        if (
          url.hostname.includes('facebook') ||
          url.hostname.includes('instagram') ||
          url.hostname.includes('youtube') ||
          url.hostname.includes('tiktok')
        ) {
          return url.toString().slice(0, 500)
        }
      }
      return ''
    }
    return url.toString().slice(0, 500)
  } catch {
    return ''
  }
}

export function sanitizeMapEmbedUrl(value: unknown): string {
  if (typeof value !== 'string') return ''
  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'https:') return ''
    const host = url.hostname.toLowerCase()
    const allowedHost =
      host === 'www.google.com' ||
      host === 'maps.google.com' ||
      host === 'www.google.com.ar'
    const allowedPath =
      url.pathname.startsWith('/maps') || url.search.includes('output=embed')
    if (!allowedHost || !allowedPath) return ''
    return url.toString().slice(0, 800)
  } catch {
    return ''
  }
}

const HTML_ALLOWED = new Set([
  'P',
  'BR',
  'H2',
  'H3',
  'UL',
  'OL',
  'LI',
  'STRONG',
  'EM',
  'B',
  'I',
  'A',
])

function sanitizeHref(href: string) {
  const url = sanitizeHttpUrl(href)
  if (url) return url
  if (href.startsWith('mailto:')) {
    const email = sanitizeEmail(href.slice(7))
    return email ? `mailto:${email}` : ''
  }
  return ''
}

function cleanNode(node: Node) {
  const children = Array.from(node.childNodes)
  for (const child of children) {
    if (child.nodeType === Node.COMMENT_NODE) {
      child.parentNode?.removeChild(child)
      continue
    }
    if (child.nodeType === Node.TEXT_NODE) continue
    if (child.nodeType !== Node.ELEMENT_NODE) {
      child.parentNode?.removeChild(child)
      continue
    }
    const el = child as HTMLElement
    if (!HTML_ALLOWED.has(el.tagName)) {
      const parent = el.parentNode
      if (parent) {
        while (el.firstChild) parent.insertBefore(el.firstChild, el)
        parent.removeChild(el)
      }
      continue
    }
    const allowed = el.tagName === 'A' ? ['href', 'rel', 'target'] : []
    for (const attr of Array.from(el.attributes)) {
      if (!allowed.includes(attr.name.toLowerCase())) el.removeAttribute(attr.name)
    }
    if (el.tagName === 'A') {
      const href = sanitizeHref(el.getAttribute('href') || '')
      if (!href) {
        el.removeAttribute('href')
      } else {
        el.setAttribute('href', href)
        el.setAttribute('rel', 'noopener noreferrer')
        el.setAttribute('target', '_blank')
      }
    }
    cleanNode(el)
  }
}

/** HTML de blog: allowlist estricta. No usa innerHTML de entrada cruda. */
export function sanitizeHtml(unsafe: unknown): string {
  if (typeof unsafe !== 'string' || !unsafe.trim()) return ''
  if (typeof DOMParser === 'undefined') return sanitizeText(unsafe, 20000)
  const parsed = new DOMParser().parseFromString(unsafe, 'text/html')
  parsed.querySelectorAll('script,style,iframe,object,embed,form,link,meta,svg').forEach((n) => n.remove())
  cleanNode(parsed.body)
  return parsed.body.innerHTML.slice(0, 50000)
}

export function encodeJsonForScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
}
