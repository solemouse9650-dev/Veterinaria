import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Textarea } from '@/components/ui/Textarea'
import { useSite } from '@/contexts/SiteContext'
import { slugify } from '@/lib/utils'
import { writeErrorMessage } from '@/lib/adminWrite'
import { AdminWriteFeedback, useAdminWrite } from '@/components/admin/AdminWriteFeedback'
import {
  createDoc,
  fetchServices,
  logActivity,
  removeDoc,
  saveDoc,
} from '@/services/firestore'
import type { Service } from '@/types'

const empty: Omit<Service, 'id'> = {
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  price: 0,
  duration: 30,
  image: '',
  category: 'Clínica',
  active: true,
  featured: false,
  order: 1,
}

export function ServicesAdmin() {
  const { refresh } = useSite()
  const [items, setItems] = useState<Service[]>([])
  const [form, setForm] = useState<Omit<Service, 'id'> & { id?: string }>(empty)
  const [loading, setLoading] = useState(true)
  const { saving, error, success, run } = useAdminWrite()

  const load = async () => {
    setLoading(true)
    try {
      setItems(await fetchServices())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const onSave = async () => {
    await run(async () => {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name),
        price: Number(form.price),
        duration: Number(form.duration),
        order: Number(form.order),
      }
      const { id, ...rest } = payload
      if (id) {
        await saveDoc('services', id, rest)
        await logActivity('servicios', `Servicio actualizado: ${rest.name}`)
      } else {
        await createDoc('services', rest)
        await logActivity('servicios', `Servicio creado: ${rest.name}`)
      }
      setForm(empty)
      await load()
      await refresh()
    })
  }

  const onEdit = (item: Service) => {
    const { id, ...rest } = item
    setForm({ id, ...rest })
  }

  const onDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar ${name}?`)) return
    try {
      await removeDoc('services', id)
      await logActivity('servicios', `Servicio eliminado: ${name}`)
      await load()
      await refresh()
    } catch (e) {
      window.alert(writeErrorMessage(e))
    }
  }

  const toggle = async (item: Service, field: 'active' | 'featured') => {
    try {
      await saveDoc('services', item.id, { [field]: !item[field] })
      await load()
      await refresh()
    } catch (e) {
      window.alert(writeErrorMessage(e))
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
        <h1 className="font-display text-3xl font-semibold">Gestión de servicios</h1>
        <p className="text-muted">Alta, edición, precios, duración e imágenes.</p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-line bg-white p-5 md:grid-cols-2">
        <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <Input label="Categoría" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <Input label="Imagen URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <Input label="Precio" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <Input label="Duración (min)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
        <Input label="Orden" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        <Input label="Descripción corta" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
        <div className="md:col-span-2">
          <Textarea label="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="flex flex-col gap-3 md:col-span-2">
          <AdminWriteFeedback error={error} success={success} />
          <div className="flex gap-3">
          <Button onClick={() => void onSave()} disabled={saving}>
            {saving ? 'Guardando…' : form.id ? 'Actualizar' : 'Agregar'}
          </Button>
          {form.id && (
            <Button variant="outline" onClick={() => setForm(empty)}>
              Cancelar edición
            </Button>
          )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-muted">
                {item.category} · ${item.price} · {item.duration} min ·{' '}
                {item.active ? 'Activo' : 'Inactivo'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(item)}>Editar</Button>
              <Button size="sm" variant="ghost" onClick={() => void toggle(item, 'active')}>
                {item.active ? 'Desactivar' : 'Activar'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => void toggle(item, 'featured')}>
                {item.featured ? 'Quitar destacado' : 'Destacar'}
              </Button>
              <Button size="sm" variant="danger" onClick={() => void onDelete(item.id, item.name)}>Eliminar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
