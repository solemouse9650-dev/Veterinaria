import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Textarea } from '@/components/ui/Textarea'
import { useSite } from '@/contexts/SiteContext'
import { fetchSiteInfo, logActivity, saveDoc } from '@/services/firestore'
import type { SiteInfo } from '@/types'

export function SiteAdmin() {
  const { refresh } = useSite()
  const [site, setSite] = useState<SiteInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void (async () => {
      setSite(await fetchSiteInfo())
      setLoading(false)
    })()
  }, [])

  const onSave = async () => {
    if (!site) return
    setSaving(true)
    try {
      await saveDoc('site', 'info', site)
      await logActivity('sitio', 'Información general actualizada')
      await refresh()
    } finally {
      setSaving(false)
    }
  }

  if (loading || !site) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Gestión del sitio</h1>
        <p className="text-muted">Modificá la información general sin tocar código.</p>
      </div>
      <div className="grid gap-4 rounded-2xl border border-line bg-white p-5 md:grid-cols-2">
        <Input label="Nombre" value={site.name} onChange={(e) => setSite({ ...site, name: e.target.value })} />
        <Input label="Tagline" value={site.tagline} onChange={(e) => setSite({ ...site, tagline: e.target.value })} />
        <Input label="Teléfono" value={site.phone} onChange={(e) => setSite({ ...site, phone: e.target.value })} />
        <Input label="WhatsApp" value={site.whatsapp} onChange={(e) => setSite({ ...site, whatsapp: e.target.value })} />
        <Input label="Email" value={site.email} onChange={(e) => setSite({ ...site, email: e.target.value })} />
        <Input label="Dirección" value={site.address} onChange={(e) => setSite({ ...site, address: e.target.value })} />
        <Input label="Ciudad" value={site.city} onChange={(e) => setSite({ ...site, city: e.target.value })} />
        <Input label="Provincia" value={site.province} onChange={(e) => setSite({ ...site, province: e.target.value })} />
        <Input label="Instagram" value={site.social.instagram} onChange={(e) => setSite({ ...site, social: { ...site.social, instagram: e.target.value } })} />
        <Input label="Facebook" value={site.social.facebook} onChange={(e) => setSite({ ...site, social: { ...site.social, facebook: e.target.value } })} />
        <div className="md:col-span-2">
          <Textarea label="Descripción" value={site.description} onChange={(e) => setSite({ ...site, description: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <Textarea label="Historia" value={site.history} onChange={(e) => setSite({ ...site, history: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <Textarea label="Misión" value={site.mission} onChange={(e) => setSite({ ...site, mission: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <Textarea label="Compromiso" value={site.commitment} onChange={(e) => setSite({ ...site, commitment: e.target.value })} />
        </div>
        <Button onClick={() => void onSave()} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  )
}
