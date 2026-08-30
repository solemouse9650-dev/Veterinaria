import { AnimatePresence, motion } from 'framer-motion'
import { Eye, Mail, MessageCircle, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { writeErrorMessage } from '@/lib/adminWrite'
import { internationalWhatsAppUrl } from '@/lib/utils'
import {
  fetchTelemedicineRequests,
  logActivity,
  updateTelemedicineRequest,
} from '@/services/firestore'
import type { TelemedicineRequest, TelemedicineStatus } from '@/types'

const statuses: TelemedicineStatus[] = [
  'pendiente',
  'contactado',
  'coordinando',
  'confirmado',
  'realizado',
  'cancelado',
]

const statusLabel: Record<TelemedicineStatus, string> = {
  pendiente: 'Pendiente',
  contactado: 'Contactado',
  coordinando: 'Coordinando',
  confirmado: 'Confirmado',
  realizado: 'Realizado',
  cancelado: 'Cancelado',
}

const methodOptions = [
  { value: '', label: 'Sin definir' },
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'Videollamada', label: 'Videollamada' },
  { value: 'Teléfono', label: 'Teléfono' },
  { value: 'Email', label: 'Email' },
  { value: 'Otro', label: 'Otro' },
]

export function TelemedicineAdmin() {
  const [items, setItems] = useState<TelemedicineRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('todas')
  const [selected, setSelected] = useState<TelemedicineRequest | null>(null)
  const [notes, setNotes] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [method, setMethod] = useState('')
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      setItems(await fetchTelemedicineRequests())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  useEffect(() => {
    if (!selected) return
    setNotes(selected.adminNotes || '')
    setScheduledAt(toDateTimeLocal(selected.scheduledAt))
    setMethod(selected.consultationMethod || '')
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
    if (status !== 'todas') data = data.filter((item) => item.status === status)
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter((item) =>
        `${item.ownerName} ${item.email} ${item.phone} ${item.petName} ${item.country}`
          .toLowerCase()
          .includes(q),
      )
    }
    return data
  }, [items, search, status])

  const persist = async (
    id: string,
    patch: Partial<
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
  ) => {
    setWorking(true)
    setError('')
    try {
      await updateTelemedicineRequest(id, {
        ...patch,
        updatedAt: new Date().toISOString(),
      })
      await logActivity('telemedicina', `Solicitud actualizada`)
      await load()
      setSelected((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev))
    } catch (e) {
      setError(writeErrorMessage(e))
    } finally {
      setWorking(false)
    }
  }

  const openWhatsApp = (item: TelemedicineRequest) => {
    window.open(
      internationalWhatsAppUrl(
        item.countryCode,
        item.phone,
        `Hola ${item.ownerName}, te escribimos de EcoVet por la solicitud de telemedicina de ${item.petName}.`,
      ),
      '_blank',
      'noopener,noreferrer',
    )
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
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Telemedicina</h1>
        <p className="text-muted">
          Solicitudes de consulta online. Las notas internas no se muestran al cliente.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { value: 'todas', label: 'Todas' },
          { value: 'pendiente', label: 'Pendientes' },
          { value: 'contactado', label: 'Contactados' },
          { value: 'coordinando', label: 'Coordinando' },
          { value: 'confirmado', label: 'Confirmadas' },
          { value: 'realizado', label: 'Realizadas' },
          { value: 'cancelado', label: 'Canceladas' },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setStatus(item.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              status === item.value
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
        placeholder="Nombre, email, teléfono, mascota o país"
      />

      <div className="space-y-3 lg:hidden">
        {filtered.map((item) => (
          <article key={item.id} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{item.ownerName}</p>
                <p className="truncate text-xs text-muted">
                  {item.city}, {item.country}
                </p>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-3 text-sm text-muted">
              {item.petName} · {item.species} · {item.consultationReason}
            </p>
            <p className="mt-1 text-xs text-muted">{formatWhen(item.createdAt)}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelected(item)}>
                <Eye className="h-4 w-4" />
                Ver
              </Button>
              <Button size="sm" variant="whatsapp" onClick={() => openWhatsApp(item)}>
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-line bg-white p-6 text-sm text-muted">
            No hay solicitudes con esos filtros.
          </p>
        )}
      </div>

      <div className="table-scroll hidden rounded-2xl border border-line bg-white lg:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-canvas text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Propietario</th>
              <th className="px-4 py-3 font-medium">Ubicación</th>
              <th className="px-4 py-3 font-medium">Contacto</th>
              <th className="px-4 py-3 font-medium">Mascota</th>
              <th className="px-4 py-3 font-medium">Motivo</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-4 py-3 font-semibold">{item.ownerName}</td>
                <td className="px-4 py-3">
                  {item.city}
                  <p className="text-xs text-muted">{item.country}</p>
                </td>
                <td className="px-4 py-3">
                  <p>{item.phone}</p>
                  <p className="text-xs text-muted">{item.email}</p>
                </td>
                <td className="px-4 py-3">
                  {item.petName}
                  <p className="text-xs text-muted">{item.species}</p>
                </td>
                <td className="px-4 py-3">{item.consultationReason}</td>
                <td className="px-4 py-3">{formatWhen(item.createdAt)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3">
                  <Button size="sm" variant="outline" onClick={() => setSelected(item)}>
                    <Eye className="h-4 w-4" />
                    Ver
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-6 text-sm text-muted">No hay solicitudes con esos filtros.</p>
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
            aria-label="Detalle de solicitud de telemedicina"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-line bg-white p-4 shadow-2xl sm:rounded-3xl sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                    Solicitud de telemedicina
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-ink">
                    {selected.ownerName}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {formatWhen(selected.createdAt)} · <StatusBadge status={selected.status} />
                  </p>
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
                <Field label="País" value={selected.country} />
                <Field label="Ciudad" value={selected.city} />
                <Field label="Email" value={selected.email} />
                <Field
                  label="Teléfono"
                  value={`${selected.countryCode} ${selected.phone}`}
                />
                <Field label="Mascota" value={selected.petName} />
                <Field label="Especie" value={selected.species} />
                <Field label="Raza" value={selected.breed} />
                <Field label="Edad" value={selected.age} />
                <Field label="Sexo" value={selected.sex} />
                <Field label="Motivo" value={selected.consultationReason} />
                <Field label="Desde cuándo" value={selected.durationNote} />
                <div className="sm:col-span-2">
                  <Field label="Descripción" value={selected.description} />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Información adicional"
                    value={selected.additionalInformation || 'Sin información adicional'}
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                <Select
                  label="Estado"
                  value={selected.status}
                  onChange={(e) =>
                    void persist(selected.id, {
                      status: e.target.value as TelemedicineStatus,
                      contactedAt:
                        e.target.value === 'contactado'
                          ? new Date().toISOString()
                          : selected.contactedAt,
                    })
                  }
                  options={statuses.map((item) => ({
                    value: item,
                    label: statusLabel[item],
                  }))}
                />
                <Select
                  label="Método de consulta"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  options={methodOptions}
                />
                <Input
                  label="Fecha y hora coordinada"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
                <div className="sm:col-span-2">
                  <Textarea
                    label="Notas internas (no visibles para el cliente)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  onClick={() =>
                    void persist(selected.id, {
                      adminNotes: notes.slice(0, 2000),
                      scheduledAt: scheduledAt
                        ? new Date(scheduledAt).toISOString()
                        : '',
                      consultationMethod: method,
                    })
                  }
                  disabled={working}
                >
                  {working ? 'Guardando…' : 'Guardar coordinación'}
                </Button>
                <Button variant="whatsapp" onClick={() => openWhatsApp(selected)}>
                  <MessageCircle className="h-4 w-4" />
                  Contactar por WhatsApp
                </Button>
                <a href={`mailto:${selected.email}?subject=Telemedicina EcoVet`}>
                  <Button variant="outline" type="button">
                    <Mail className="h-4 w-4" />
                    Enviar email
                  </Button>
                </a>
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

function StatusBadge({ status }: { status: TelemedicineStatus }) {
  const styles: Record<TelemedicineStatus, string> = {
    pendiente: 'bg-amber-100 text-amber-800',
    contactado: 'bg-sky-100 text-sky-800',
    coordinando: 'bg-indigo-100 text-indigo-800',
    confirmado: 'bg-brand-100 text-brand-800',
    realizado: 'bg-emerald-100 text-emerald-800',
    cancelado: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
      {statusLabel[status]}
    </span>
  )
}

function formatWhen(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('es-AR')
}

function toDateTimeLocal(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
