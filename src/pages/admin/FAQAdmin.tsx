import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Textarea } from '@/components/ui/Textarea'
import { useSite } from '@/contexts/SiteContext'
import { createDoc, fetchFaqs, logActivity, removeDoc, saveDoc } from '@/services/firestore'
import { writeErrorMessage } from '@/lib/adminWrite'
import { AdminWriteFeedback, useAdminWrite } from '@/components/admin/AdminWriteFeedback'
import type { FAQ } from '@/types'

export function FAQAdmin() {
  const { refresh } = useSite()
  const [items, setItems] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ id: '', question: '', answer: '', order: 1, active: true })
  const { saving, error, success, run } = useAdminWrite()

  const load = async () => {
    setLoading(true)
    try {
      setItems(await fetchFaqs())
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
        question: form.question,
        answer: form.answer,
        order: Number(form.order),
        active: form.active,
      }
      if (form.id) await saveDoc('faqs', form.id, payload)
      else await createDoc('faqs', payload)
      await logActivity('faqs', 'FAQ guardada')
      setForm({ id: '', question: '', answer: '', order: 1, active: true })
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
        <h1 className="font-display text-3xl font-semibold">Preguntas frecuentes</h1>
        <p className="text-muted">Administrá el accordion del sitio público.</p>
      </div>
      <div className="grid gap-4 rounded-2xl border border-line bg-white p-5">
        <Input label="Pregunta" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
        <Textarea label="Respuesta" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
        <Input label="Orden" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        <AdminWriteFeedback error={error} success={success} />
        <Button onClick={() => void onSave()} disabled={saving}>
          {saving ? 'Guardando…' : form.id ? 'Actualizar' : 'Agregar'}
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-line bg-white p-4">
            <p className="font-semibold">{item.question}</p>
            <p className="mt-1 text-sm text-muted">{item.answer}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setForm(item)}>Editar</Button>
              <Button size="sm" variant="danger" onClick={() => void (async () => {
                if (!confirm('¿Eliminar?')) return
                try {
                  await removeDoc('faqs', item.id)
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
