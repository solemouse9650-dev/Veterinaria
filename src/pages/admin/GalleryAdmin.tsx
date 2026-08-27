import { useEffect, useState } from 'react'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Select } from '@/components/ui/Select'
import { useSite } from '@/contexts/SiteContext'
import { storage } from '@/lib/firebase'
import {
  createDoc,
  fetchGallery,
  logActivity,
  removeDoc,
  saveDoc,
} from '@/services/firestore'
import type { GalleryItem } from '@/types'

export function GalleryAdmin() {
  const { refresh } = useSite()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    id: '',
    title: '',
    image: '',
    type: 'image' as 'image' | 'video',
    category: 'Instalaciones',
    order: 1,
  })

  const load = async () => {
    setLoading(true)
    try {
      setItems(await fetchGallery())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const onUpload = async (file: File | null) => {
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      window.alert('Solo se permiten imágenes JPG, PNG, WEBP o GIF.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      window.alert('La imagen no puede superar los 5 MB.')
      return
    }
    setUploading(true)
    try {
      const ext =
        file.type === 'image/png'
          ? 'png'
          : file.type === 'image/webp'
            ? 'webp'
            : file.type === 'image/gif'
              ? 'gif'
              : 'jpg'
      const path = `gallery/${crypto.randomUUID()}.${ext}`
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, file, { contentType: file.type })
      const url = await getDownloadURL(storageRef)
      setForm((f) => ({ ...f, image: url, type: 'image' }))
    } finally {
      setUploading(false)
    }
  }

  const onSave = async () => {
    const payload = {
      title: form.title,
      image: form.image,
      type: form.type,
      category: form.category,
      order: Number(form.order),
    }
    if (form.id) await saveDoc('gallery', form.id, payload)
    else await createDoc('gallery', payload)
    await logActivity('galeria', `Elemento ${form.id ? 'actualizado' : 'creado'}`)
    setForm({
      id: '',
      title: '',
      image: '',
      type: 'image',
      category: 'Instalaciones',
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
        <h1 className="font-display text-3xl font-semibold">Gestión de galería</h1>
        <p className="text-muted">Subí imágenes a Firebase Storage u organizá URLs.</p>
      </div>
      <div className="grid gap-4 rounded-2xl border border-line bg-white p-5 md:grid-cols-2">
        <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Input label="Categoría" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <Select
          label="Tipo"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as 'image' | 'video' })}
          options={[
            { value: 'image', label: 'Imagen' },
            { value: 'video', label: 'Video' },
          ]}
        />
        <Input label="Orden" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        <Input label="URL imagen/video" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Subir archivo</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="block w-full text-sm"
            onChange={(e) => void onUpload(e.target.files?.[0] || null)}
          />
          {uploading && <span className="text-brand-700">Subiendo…</span>}
        </label>
        <Button onClick={() => void onSave()}>{form.id ? 'Actualizar' : 'Agregar'}</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-line bg-white">
            {item.type === 'image' ? (
              <img src={item.image} alt={item.title} className="aspect-video w-full object-cover" />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-ink text-white">Video</div>
            )}
            <div className="space-y-2 p-3">
              <p className="font-semibold">{item.title}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setForm({ ...item })}>Editar</Button>
                <Button size="sm" variant="danger" onClick={() => void (async () => {
                  if (!confirm('¿Eliminar?')) return
                  await removeDoc('gallery', item.id)
                  await load()
                  await refresh()
                })()}>Eliminar</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
