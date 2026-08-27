import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useSite } from '@/contexts/SiteContext'
import { fetchHours, logActivity, saveDoc } from '@/services/firestore'
import type { HoursConfig, OpenStatusOverride } from '@/types'

export function HoursAdmin() {
  const { refresh } = useSite()
  const [hours, setHours] = useState<HoursConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void (async () => {
      setHours(await fetchHours())
      setLoading(false)
    })()
  }, [])

  const onSave = async () => {
    if (!hours) return
    setSaving(true)
    try {
      const rest = {
        regular: hours.regular,
        holidays: hours.holidays,
        vacations: hours.vacations,
        emergencyNote: hours.emergencyNote,
        statusOverride: hours.statusOverride,
        statusNote: hours.statusNote,
      }
      await saveDoc('hours', 'main', rest)
      await logActivity('horarios', 'Horarios actualizados')
      await refresh()
    } finally {
      setSaving(false)
    }
  }

  if (loading || !hours) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Gestión de horarios</h1>
        <p className="text-muted">
          Días, horarios, feriados y el indicador de abierto/cerrado que ve el público.
        </p>
      </div>
      <div className="space-y-3 rounded-2xl border border-line bg-white p-5">
        <div className="grid gap-3 rounded-2xl border border-brand-200 bg-brand-50/70 p-4 md:grid-cols-2">
          <Select
            label="Indicador en la web"
            value={hours.statusOverride}
            onChange={(e) =>
              setHours({
                ...hours,
                statusOverride: e.target.value as OpenStatusOverride,
              })
            }
            options={[
              { value: 'auto', label: 'Automático (según horario)' },
              { value: 'open', label: 'Forzar abierto' },
              { value: 'closed', label: 'Forzar cerrado (feriado u otro)' },
            ]}
          />
          <Input
            label="Motivo (opcional)"
            placeholder="Ej. Cerrado por feriado"
            value={hours.statusNote}
            onChange={(e) => setHours({ ...hours, statusNote: e.target.value })}
          />
          <p className="text-sm text-muted md:col-span-2">
            Usá “Forzar cerrado” un feriado o un cierre extra. Cuando vuelva el horario
            habitual, dejalo en automático.
          </p>
        </div>
        {hours.regular.map((day, index) => (
          <div key={day.day} className="grid gap-3 md:grid-cols-4">
            <Input label="Día" value={day.day} onChange={(e) => {
              const regular = [...hours.regular]
              regular[index] = { ...day, day: e.target.value }
              setHours({ ...hours, regular })
            }} />
            <Input label="Apertura" value={day.open} onChange={(e) => {
              const regular = [...hours.regular]
              regular[index] = { ...day, open: e.target.value }
              setHours({ ...hours, regular })
            }} />
            <Input label="Cierre" value={day.close} onChange={(e) => {
              const regular = [...hours.regular]
              regular[index] = { ...day, close: e.target.value }
              setHours({ ...hours, regular })
            }} />
            <label className="flex items-end gap-2 pb-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={day.closed}
                onChange={(e) => {
                  const regular = [...hours.regular]
                  regular[index] = { ...day, closed: e.target.checked }
                  setHours({ ...hours, regular })
                }}
              />
              Cerrado
            </label>
          </div>
        ))}
        <Textarea
          label="Nota de emergencias"
          value={hours.emergencyNote}
          onChange={(e) => setHours({ ...hours, emergencyNote: e.target.value })}
        />
        <div className="grid gap-3 md:grid-cols-3">
          <Input
            label="Feriado (fecha)"
            type="date"
            value={hours.holidays[0]?.date || ''}
            onChange={(e) =>
              setHours({
                ...hours,
                holidays: [
                  {
                    date: e.target.value,
                    name: hours.holidays[0]?.name || 'Feriado',
                    closed: true,
                  },
                ],
              })
            }
          />
          <Input
            label="Nombre feriado"
            value={hours.holidays[0]?.name || ''}
            onChange={(e) =>
              setHours({
                ...hours,
                holidays: [
                  {
                    date: hours.holidays[0]?.date || '',
                    name: e.target.value,
                    closed: true,
                  },
                ],
              })
            }
          />
          <Input
            label="Vacaciones (inicio)"
            type="date"
            value={hours.vacations[0]?.start || ''}
            onChange={(e) =>
              setHours({
                ...hours,
                vacations: [
                  {
                    start: e.target.value,
                    end: hours.vacations[0]?.end || '',
                    note: hours.vacations[0]?.note || 'Vacaciones',
                  },
                ],
              })
            }
          />
        </div>
        <Button onClick={() => void onSave()} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar horarios'}
        </Button>
      </div>
    </div>
  )
}
