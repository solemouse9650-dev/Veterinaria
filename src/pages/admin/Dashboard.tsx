import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { fetchActivity, fetchReservations } from '@/services/firestore'
import type { ActivityLog, Reservation } from '@/types'
import { formatPrice } from '@/lib/utils'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function AdminDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [activity, setActivity] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      try {
        const [res, act] = await Promise.all([
          fetchReservations(),
          fetchActivity(),
        ])
        setReservations(res)
        setActivity(act)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const stats = useMemo(() => {
    const confirmed = reservations.filter((r) => r.status !== 'cancelada')
    const revenue = confirmed.reduce((acc, r) => acc + (r.estimatedPrice || 0), 0)
    const serviceCount = confirmed.reduce<Record<string, number>>((acc, r) => {
      acc[r.serviceName || 'Sin servicio'] =
        (acc[r.serviceName || 'Sin servicio'] || 0) + 1
      return acc
    }, {})
    const chart = Object.entries(serviceCount)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)
    const upcoming = confirmed
      .filter((r) => r.status === 'pendiente' || r.status === 'confirmada')
      .slice(0, 5)
    const clients = new Set(confirmed.map((r) => r.email)).size
    return { revenue, chart, upcoming, clients, total: reservations.length }
  }, [reservations])

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
        <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted">Resumen operativo de EcoVet</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Reservas totales', value: String(stats.total) },
          { label: 'Clientes registrados', value: String(stats.clients) },
          { label: 'Ingresos estimados', value: formatPrice(stats.revenue) },
          {
            label: 'Próximos turnos',
            value: String(stats.upcoming.length),
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-line bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-brand-800">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-4 font-semibold">Servicios más solicitados</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#5b7853" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-4 font-semibold">Próximos turnos</h2>
          <div className="space-y-3">
            {stats.upcoming.length === 0 && (
              <p className="text-sm text-muted">Aún no hay turnos próximos.</p>
            )}
            {stats.upcoming.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-line px-4 py-3 text-sm"
              >
                <p className="font-semibold">
                  {r.firstName} {r.lastName} · {r.petName}
                </p>
                <p className="text-muted">
                  {r.serviceName} · {r.date} {r.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-5">
        <h2 className="mb-4 font-semibold">Actividad reciente</h2>
        <div className="space-y-3">
          {activity.length === 0 && (
            <p className="text-sm text-muted">Sin actividad registrada todavía.</p>
          )}
          {activity.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-1 border-b border-line pb-3 text-sm last:border-0"
            >
              <p className="font-semibold capitalize">{item.action}</p>
              <p className="text-muted">{item.detail}</p>
              <p className="text-xs text-muted">
                {new Date(item.createdAt).toLocaleString('es-AR')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
