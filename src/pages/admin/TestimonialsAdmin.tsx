import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Textarea } from '@/components/ui/Textarea'
import { useSite } from '@/contexts/SiteContext'
import {
  createDoc,
  fetchTestimonials,
  logActivity,
  removeDoc,
  saveDoc,
} from '@/services/firestore'
import type { Testimonial } from '@/types'

export function TestimonialsAdmin() {
  const { refresh } = useSite()
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    id: '',
    name: '',
    petName: '',
    rating: 5,
    comment: '',
    image: '',
    active: true,
    order: 1,
  })

  const load = async () => {
    setLoading(true)
    try {
      setItems(await fetchTestimonials())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const onSave = async () => {
    const payload = {
      name: form.name,
      petName: form.petName,
      rating: Number(form.rating),
      comment: form.comment,
      image: form.image,
      active: form.active,
      order: Number(form.order),
    }
    if (form.id) await saveDoc('testimonials', form.id, payload)
    else await createDoc('testimonials', payload)
    await logActivity('testimonios', 'Testimonio guardado')
    setForm({
      id: '',
      name: '',
      petName: '',
      rating: 5,
      comment: '',
      image: '',
      active: true,
      order: 1,
    })
    await load()
    await refresh()
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
        <h1 className="font-display text-3xl font-semibold">Testimonios</h1>
        <p className="text-muted">Opiniones y calificaciones del sitio.</p>
      </div>
      <div className="grid gap-4 rounded-2xl border border-line bg-white p-5 md:grid-cols-2">
        <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Mascota" value={form.petName} onChange={(e) => setForm({ ...form, petName: e.target.value })} />
        <Input label="Calificación" type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
        <Input label="Foto URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <div className="md:col-span-2">
          <Textarea label="Comentario" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
        </div>
        <Button onClick={() => void onSave()}>{form.id ? 'Actualizar' : 'Agregar'}</Button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-line bg-white p-4">
            <p className="font-semibold">
              {item.name} · {item.petName} · {'★'.repeat(item.rating)}
            </p>
            <p className="mt-1 text-sm text-muted">{item.comment}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setForm(item)}>Editar</Button>
              <Button size="sm" variant="danger" onClick={() => void (async () => {
                if (!confirm('¿Eliminar?')) return
                await removeDoc('testimonials', item.id)
                await load()
                await refresh()
              })()}>Eliminar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
