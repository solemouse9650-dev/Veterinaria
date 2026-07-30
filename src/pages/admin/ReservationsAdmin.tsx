import { AnimatePresence, motion } from 'framer-motion'
import { Eye, MessageCircle, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Select } from '@/components/ui/Select'
import {
  formatDate,
  formatPrice,
  reservationConfirmMessage,
  whatsappUrl,
} from '@/lib/utils'
import {
  deleteReservation,
  fetchReservations,
  logActivity,
  updateReservation,
} from '@/services/firestore'
import type { Reservation, ReservationStatus } from '@/types'

const statuses: ReservationStatus[] = [
  'pendiente',
  'confirmada',
  'completada',
  'cancelada',
]

export function ReservationsAdmin() {
  const [items, setItems] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('todos')
  const [sort, setSort] = useState('recientes')
  const [selected, setSelected] = useState<Reservation | null>(null)
  const [working, setWorking] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      setItems(await fetchReservations())
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
    if (status !== 'todos') data = data.filter((r) => r.status === status)
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(
        (r) =>
          `${r.firstName} ${r.lastName} ${r.petName} ${r.email} ${r.phone} ${r.serviceName}`
            .toLowerCase()
            .includes(q),
      )
    }
    data.sort((a, b) => {
      if (sort === 'fecha') return `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)
      if (sort === 'nombre')
        return `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    return data
  }, [items, search, status, sort])

  const setStatusOf = async (id: string, next: ReservationStatus) => {
    setWorking(true)
    try {
      await updateReservation(id, {
        status: next,
        updatedAt: new Date().toISOString(),
      })
      await logActivity('reserva', `Estado actualizado a ${next}`)
      await load()
      setSelected((prev) => (prev && prev.id === id ? { ...prev, status: next } : prev))
    } finally {
      setWorking(false)
    }
  }

  const confirmAndWhatsApp = async (r: Reservation) => {
    await setStatusOf(r.id, 'confirmada')
    const url = whatsappUrl(r.phone, reservationConfirmMessage(r))
    window.open(url, '_blank', 'noopener,noreferrer')
    await logActivity(
      'whatsapp',
      `Confirmación enviada por WhatsApp a ${r.firstName} ${r.lastName} (${r.phone})`,
    )
  }

  const openWhatsApp = async (r: Reservation) => {
    const url = whatsappUrl(
      r.phone,
      `Hola ${r.firstName}, te escribimos de EcoVet por el turno de ${r.petName} (${r.serviceName}) el ${r.date} a las ${r.time}.`,
    )
    window.open(url, '_blank', 'noopener,noreferrer')
    await logActivity(
      'whatsapp',
      `WhatsApp abierto para ${r.firstName} ${r.lastName} (${r.phone})`,
    )
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar esta reserva?')) return
    await deleteReservation(id)
    await logActivity('reserva', 'Reserva eliminada')
    setSelected(null)
    await load()
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
        <h1 className="font-display text-3xl font-semibold">Gestión de reservas</h1>
        <p className="text-muted">
          Ver detalle completo, confirmar turnos y contactar por WhatsApp.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Input
          label="Buscar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cliente, teléfono, mascota, servicio…"
        />
        <Select
          label="Estado"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: 'todos', label: 'Todos' },
            ...statuses.map((s) => ({ value: s, label: s })),
          ]}
        />
        <Select
          label="Ordenar"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          options={[
            { value: 'recientes', label: 'Más recientes' },
            { value: 'fecha', label: 'Fecha de turno' },
            { value: 'nombre', label: 'Nombre' },
          ]}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-canvas text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Teléfono</th>
              <th className="px-4 py-3 font-medium">Mascota</th>
              <th className="px-4 py-3 font-medium">Servicio</th>
              <th className="px-4 py-3 font-medium">Turno</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <p className="font-semibold">
                    {r.firstName} {r.lastName}
                  </p>
                  <p className="text-xs text-muted">{r.email}</p>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={whatsappUrl(r.phone)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-brand-700 hover:underline"
                  >
                    {r.phone}
                  </a>
                </td>
                <td className="px-4 py-3">
                  {r.petName}
                  <p className="text-xs text-muted">
                    {r.species} · {r.breed}
                  </p>
                </td>
                <td className="px-4 py-3">{r.serviceName}</td>
                <td className="px-4 py-3">
                  {r.date} {r.time}
                  <p className="text-xs text-muted">{r.veterinarianName}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelected(r)}>
                      <Eye className="h-4 w-4" />
                      Ver
                    </Button>
                    <Button size="sm" variant="whatsapp" onClick={() => void openWhatsApp(r)}>
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => void confirmAndWhatsApp(r)}
                      disabled={working || r.status === 'confirmada'}
                    >
                      Confirmar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-6 text-sm text-muted">No hay reservas con esos filtros.</p>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Detalle de reserva"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-line bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                    Reserva completa
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-ink">
                    {selected.firstName} {selected.lastName}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Ref. {selected.id.slice(0, 8).toUpperCase()} ·{' '}
                    <StatusBadge status={selected.status} />
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
                <Field label="Teléfono / WhatsApp" value={selected.phone} />
                <Field label="Correo" value={selected.email} />
                <Field label="Mascota" value={selected.petName} />
                <Field label="Especie" value={selected.species} />
                <Field label="Raza" value={selected.breed} />
                <Field label="Edad" value={selected.age} />
                <Field label="Peso" value={selected.weight} />
                <Field label="Servicio" value={selected.serviceName} />
                <Field
                  label="Fecha"
                  value={selected.date ? formatDate(selected.date) : '—'}
                />
                <Field label="Hora" value={selected.time} />
                <Field label="Veterinario/a" value={selected.veterinarianName} />
                <Field
                  label="Precio estimado"
                  value={formatPrice(selected.estimatedPrice || 0)}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Observaciones"
                    value={selected.notes?.trim() ? selected.notes : 'Sin observaciones'}
                  />
                </div>
                <Field
                  label="Creada"
                  value={new Date(selected.createdAt).toLocaleString('es-AR')}
                />
                <Field
                  label="Actualizada"
                  value={new Date(selected.updatedAt).toLocaleString('es-AR')}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
                <Button
                  variant="whatsapp"
                  onClick={() => void openWhatsApp(selected)}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp directo
                </Button>
                <Button
                  onClick={() => void confirmAndWhatsApp(selected)}
                  disabled={working}
                >
                  Confirmar y avisar por WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void setStatusOf(selected.id, 'completada')}
                  disabled={working}
                >
                  Marcar completada
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => void setStatusOf(selected.id, 'cancelada')}
                  disabled={working}
                >
                  Cancelar turno
                </Button>
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
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-ink">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  const styles: Record<ReservationStatus, string> = {
    pendiente: 'bg-amber-100 text-amber-800',
    confirmada: 'bg-brand-100 text-brand-800',
    completada: 'bg-sky-100 text-sky-800',
    cancelada: 'bg-red-100 text-red-700',
  }
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  )
}
