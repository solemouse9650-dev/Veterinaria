import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Textarea } from '@/components/ui/Textarea'
import { useSite } from '@/contexts/SiteContext'
import { createDoc, fetchTeam, logActivity, removeDoc, saveDoc } from '@/services/firestore'
import { writeErrorMessage } from '@/lib/adminWrite'
import { AdminWriteFeedback, useAdminWrite } from '@/components/admin/AdminWriteFeedback'
import type { TeamMember } from '@/types'

const empty: Omit<TeamMember, 'id'> = {
  name: '',
  specialty: '',
  description: '',
  experience: '',
  image: '',
  schedule: '',
  active: true,
  order: 1,
  areas: [],
}

export function TeamAdmin() {
  const { refresh } = useSite()
  const [items, setItems] = useState<TeamMember[]>([])
  const [form, setForm] = useState<Omit<TeamMember, 'id'> & { id?: string }>(empty)
  const [loading, setLoading] = useState(true)
  const { saving, error, success, run } = useAdminWrite()

  const load = async () => {
    setLoading(true)
    try {
      setItems(await fetchTeam())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const onSave = async () => {
    await run(async () => {
      const { id, ...rest } = form
      if (id) await saveDoc('team', id, rest)
      else await createDoc('team', rest)
      await logActivity('equipo', `${id ? 'Actualizado' : 'Creado'}: ${rest.name}`)
      setForm(empty)
      await load()
      await refresh()
    })
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
        <h1 className="font-display text-3xl font-semibold">Gestión del equipo</h1>
        <p className="text-muted">Veterinarios, especialidades, fotos y horarios.</p>
      </div>
      <div className="grid gap-4 rounded-2xl border border-line bg-white p-5 md:grid-cols-2">
        <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Especialidad" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
        <Input label="Experiencia" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
        <Input label="Horarios" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} />
        <Input label="Foto URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <Input label="Orden" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        <div className="md:col-span-2">
          <Textarea
            label="Áreas o servicios (uno por línea)"
            value={(form.areas || []).join('\n')}
            onChange={(e) =>
              setForm({
                ...form,
                areas: e.target.value
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean),
              })
            }
          />
        </div>
        <div className="md:col-span-2">
          <Textarea label="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <AdminWriteFeedback error={error} success={success} />
        <Button onClick={() => void onSave()} disabled={saving}>
          {saving ? 'Guardando…' : form.id ? 'Actualizar' : 'Agregar'}
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="h-14 w-14 rounded-full object-cover" />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted">{item.specialty}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => {
                const { id, ...rest } = item
                setForm({ id, ...rest })
              }}>Editar</Button>
              <Button size="sm" variant="danger" onClick={() => void (async () => {
                if (!confirm('¿Eliminar?')) return
                try {
                  await removeDoc('team', item.id)
                  await load()
                  await refresh()
                } catch (e) {
                  window.alert(writeErrorMessage(e))
                }
              })()}>Eliminar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
