import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Textarea } from '@/components/ui/Textarea'
import { useSite } from '@/contexts/SiteContext'
import { fetchHero, logActivity, saveDoc } from '@/services/firestore'
import type { HeroContent } from '@/types'

export function HeroAdmin() {
  const { refresh } = useSite()
  const [hero, setHero] = useState<HeroContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void (async () => {
      setHero(await fetchHero())
      setLoading(false)
    })()
  }, [])

  const onSave = async () => {
    if (!hero) return
    setSaving(true)
    try {
      await saveDoc('site', 'hero', hero)
      await logActivity('hero', 'Hero actualizado')
      await refresh()
    } finally {
      setSaving(false)
    }
  }

  if (loading || !hero) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Gestión del Hero</h1>
        <p className="text-muted">Título, subtítulo, botones e imagen principal.</p>
      </div>
      <div className="grid gap-4 rounded-2xl border border-line bg-white p-5">
        <Input label="Título" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} />
        <Textarea label="Subtítulo" value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} />
        <Input label="Imagen URL" value={hero.image} onChange={(e) => setHero({ ...hero, image: e.target.value })} />
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="CTA primario" value={hero.ctaPrimary} onChange={(e) => setHero({ ...hero, ctaPrimary: e.target.value })} />
          <Input label="CTA secundario" value={hero.ctaSecondary} onChange={(e) => setHero({ ...hero, ctaSecondary: e.target.value })} />
          <Input label="CTA terciario" value={hero.ctaTertiary} onChange={(e) => setHero({ ...hero, ctaTertiary: e.target.value })} />
        </div>
        {hero.stats.map((stat, index) => (
          <div key={index} className="grid gap-3 md:grid-cols-2">
            <Input
              label={`Stat ${index + 1} valor`}
              value={stat.value}
              onChange={(e) => {
                const stats = [...hero.stats]
                stats[index] = { ...stat, value: e.target.value }
                setHero({ ...hero, stats })
              }}
            />
            <Input
              label={`Stat ${index + 1} etiqueta`}
              value={stat.label}
              onChange={(e) => {
                const stats = [...hero.stats]
                stats[index] = { ...stat, label: e.target.value }
                setHero({ ...hero, stats })
              }}
            />
          </div>
        ))}
        <Button onClick={() => void onSave()} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar Hero'}
        </Button>
      </div>
    </div>
  )
}
