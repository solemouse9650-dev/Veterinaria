import { AnimatePresence, motion } from 'framer-motion'
import { Eye, Mail, MessageCircle, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { writeErrorMessage } from '@/lib/adminWrite'
import { whatsappUrl } from '@/lib/utils'
import {
  deleteContactMessage,
  fetchContactMessages,
  logActivity,
  updateContactMessage,
} from '@/services/firestore'
import type { ContactMessage } from '@/types'

export function MessagesAdmin() {
  const [items, setItems] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('todos')
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      setItems(await fetchContactMessages())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [selected])

  const filtered = useMemo(() => {
    let data = [...items]
    if (filter === 'no-leidos') data = data.filter((item) => item.read !== true)
    if (filter === 'leidos') data = data.filter((item) => item.read === true)
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter((item) =>
        `${item.name} ${item.email} ${item.phone} ${item.message}`
          .toLowerCase()
          .includes(q),
      )
    }
    return data
  }, [items, filter, search])

  const setRead = async (item: ContactMessage, read: boolean) => {
    setWorking(true)
    setError('')
    try {
      await updateContactMessage(item.id, { read })
      await logActivity('mensaje', read ? 'Mensaje marcado como leído' : 'Mensaje marcado como no leído')
      await load()
      setSelected((prev) => (prev && prev.id === item.id ? { ...prev, read } : prev))
    } catch (e) {
      setError(writeErrorMessage(e))
    } finally {
      setWorking(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este mensaje?')) return
    setWorking(true)
    setError('')
    try {
      await deleteContactMessage(id)
      await logActivity('mensaje', 'Mensaje de contacto eliminado')
      setSelected(null)
      await load()
    } catch (e) {
      setError(writeErrorMessage(e))
    } finally {
      setWorking(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Mensajes</h1>
        <p className="text-muted">
          Mensajes enviados desde el formulario de Contacto.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { value: 'todos', label: 'Todos' },
          { value: 'no-leidos', label: 'No leídos' },
          { value: 'leidos', label: 'Leídos' },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              filter === item.value
                ? 'bg-brand-600 text-white'
                : 'border border-line bg-white text-muted hover:text-ink'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <Input
        label="Buscar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Nombre, email, teléfono o mensaje"
      />

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {filtered.map((item) => (
          <article
            key={item.id}
            className={`rounded-2xl border bg-white p-4 shadow-sm ${
              item.read === true ? 'border-line' : 'border-brand-300 bg-brand-50/40'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{item.name}</p>
                <p className="truncate text-xs text-muted">{item.email}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  item.read === true
                    ? 'bg-canvas text-muted'
                    : 'bg-brand-100 text-brand-800'
                }`}
              >
                {item.read === true ? 'Leído' : 'No leído'}
              </span>
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-muted">{item.message}</p>
            <p className="mt-2 text-xs text-muted">{formatWhen(item.createdAt)}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <Button size="sm" variant="outline" onClick={() => setSelected(item)}>
                <Eye className="h-4 w-4" />
                Ver
              </Button>
              <Button
                size="sm"
                variant="whatsapp"
                onClick={() =>
                  window.open(whatsappUrl(item.phone), '_blank', 'noopener,noreferrer')
                }
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-line bg-white p-6 text-sm text-muted">
            No hay mensajes con esos filtros.
          </p>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Detalle del mensaje"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-line bg-white p-4 shadow-2xl sm:rounded-3xl sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                    Mensaje de contacto
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-ink">
                    {selected.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted">{formatWhen(selected.createdAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-full border border-line p-2 text-muted hover:bg-canvas focus-ring"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Email" value={selected.email} />
                <Field label="Teléfono" value={selected.phone} />
                <div className="sm:col-span-2">
                  <Field label="Mensaje" value={selected.message} />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  onClick={() => void setRead(selected, selected.read !== true)}
                  disabled={working}
                >
                  {selected.read === true ? 'Marcar como no leído' : 'Marcar como leído'}
                </Button>
                <Button
                  variant="whatsapp"
                  onClick={() =>
                    window.open(
                      whatsappUrl(selected.phone),
                      '_blank',
                      'noopener,noreferrer',
                    )
                  }
                >
                  <MessageCircle className="h-4 w-4" />
                  Contactar por WhatsApp
                </Button>
                <a href={`mailto:${selected.email}?subject=EcoVet Clínica Veterinaria`}>
                  <Button variant="outline" type="button">
                    <Mail className="h-4 w-4" />
                    Enviar email
                  </Button>
                </a>
                <Button
                  variant="danger"
                  onClick={() => void remove(selected.id)}
                  disabled={working}
                >
                  Eliminar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-canvas/70 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm font-medium text-ink">{value}</p>
    </div>
  )
}

function formatWhen(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('es-AR')
}
