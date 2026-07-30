import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Select } from '@/components/ui/Select'
import {
  deleteReservation,
  fetchReservations,
  logActivity,
  updateReservation,
} from '@/services/firestore'
import type { Reservation, ReservationStatus } from '@/types'
import { formatPrice } from '@/lib/utils'

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

  const filtered = useMemo(() => {
    let data = [...items]
    if (status !== 'todos') data = data.filter((r) => r.status === status)
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(
        (r) =>
          `${r.firstName} ${r.lastName} ${r.petName} ${r.email} ${r.serviceName}`
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
    await updateReservation(id, {
      status: next,
      updatedAt: new Date().toISOString(),
    })
    await logActivity('reserva', `Estado actualizado a ${next}`)
    await load()
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar esta reserva?')) return
    await deleteReservation(id)
    await logActivity('reserva', 'Reserva eliminada')
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
        <p className="text-muted">Crear, filtrar, aceptar, cancelar y eliminar turnos.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Input
          label="Buscar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cliente, mascota, servicio…"
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
                  <p className="text-xs text-muted">{formatPrice(r.estimatedPrice || 0)}</p>
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
                <td className="px-4 py-3 capitalize">{r.status}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => void setStatusOf(r.id, 'confirmada')}>
                      Aceptar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => void setStatusOf(r.id, 'cancelada')}>
                      Cancelar
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => void remove(r.id)}>
                      Eliminar
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
    </div>
  )
}
