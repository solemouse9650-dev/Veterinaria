import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Textarea } from '@/components/ui/Textarea'
import { useSite } from '@/contexts/SiteContext'
import { slugify } from '@/lib/utils'
import { createDoc, fetchBlog, logActivity, removeDoc, saveDoc } from '@/services/firestore'
import type { BlogPost } from '@/types'

const empty: Omit<BlogPost, 'id'> = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  image: '',
  category: 'Consejos',
  author: 'Equipo EcoVet',
  published: true,
  publishedAt: new Date().toISOString().slice(0, 10),
  createdAt: new Date().toISOString(),
}

export function BlogAdmin() {
  const { refresh } = useSite()
  const [items, setItems] = useState<BlogPost[]>([])
  const [form, setForm] = useState<Omit<BlogPost, 'id'> & { id?: string }>(empty)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      setItems(await fetchBlog())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const onSave = async () => {
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      published: Boolean(form.published),
    }
    const { id, ...rest } = payload
    if (id) await saveDoc('blog', id, rest)
    else await createDoc('blog', rest)
    await logActivity('blog', `Artículo ${id ? 'actualizado' : 'creado'}: ${rest.title}`)
    setForm(empty)
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
        <h1 className="font-display text-3xl font-semibold">Gestión del blog</h1>
        <p className="text-muted">Crear, editar, programar y categorizar artículos.</p>
      </div>
      <div className="grid gap-4 rounded-2xl border border-line bg-white p-5 md:grid-cols-2">
        <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <Input label="Categoría" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <Input label="Autor" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
        <Input label="Imagen URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <Input label="Fecha publicación" type="date" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
        <Input label="Extracto" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Publicado
        </label>
        <div className="md:col-span-2">
          <Textarea
            label="Contenido HTML"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="min-h-40"
          />
        </div>
        <Button onClick={() => void onSave()}>{form.id ? 'Actualizar' : 'Crear artículo'}</Button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted">
                {item.category} · {item.publishedAt} · {item.published ? 'Publicado' : 'Borrador'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => {
                const { id, ...rest } = item
                setForm({ id, ...rest })
              }}>Editar</Button>
              <Button size="sm" variant="danger" onClick={() => void (async () => {
                if (!confirm('¿Eliminar artículo?')) return
                await removeDoc('blog', item.id)
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
