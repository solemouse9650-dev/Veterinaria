import { Play } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SEO } from '@/components/seo/SEO'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Lightbox } from '@/components/ui/Lightbox'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useSite } from '@/contexts/SiteContext'
import { cn } from '@/lib/utils'
import type { GalleryItem } from '@/types'

const filters = ['Todos', 'Pacientes', 'Instalaciones'] as const

export function Gallery() {
  const { gallery } = useSite()
  const [active, setActive] = useState<GalleryItem | null>(null)
  const [filter, setFilter] = useState<(typeof filters)[number]>('Todos')
  const [failedMedia, setFailedMedia] = useState<Record<string, boolean>>({})

  const items = useMemo(() => {
    const sorted = [...gallery].sort((a, b) => a.order - b.order)
    if (filter === 'Todos') return sorted
    return sorted.filter((item) => item.category === filter)
  }, [gallery, filter])

  return (
    <>
      <SEO
        title="Galería"
        description="Pacientes e instalaciones de EcoVet Clínica Veterinaria en Apóstoles."
        path="/galeria"
      />
      <section className="section-pad page-top">
        <div className="container-page">
          <SectionHeading
            eyebrow="Galería"
            title="Pacientes e instalaciones"
            description="Un recorrido visual por EcoVet: quienes nos visitan y los espacios donde los atendemos."
          />
          <div className="mb-6 flex flex-wrap justify-center gap-2 sm:mb-8">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition',
                  filter === item
                    ? 'bg-brand-600 text-white'
                    : 'border border-line bg-white text-muted hover:text-ink',
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {items.map((item, i) => (
              <AnimatedSection
                key={item.id}
                delay={Math.min(i, 12) * 0.03}
                className="mb-4 break-inside-avoid"
              >
                <button
                  type="button"
                  onClick={() => setActive(item)}
                  className="group relative w-full overflow-hidden rounded-3xl focus-ring"
                >
                  {item.type === 'video' ? (
                    failedMedia[item.id] ? (
                      <div className="flex aspect-[4/5] items-center justify-center bg-brand-900 text-sm text-white">
                        Paciente
                      </div>
                    ) : (
                      <div className="relative">
                        <video
                          src={item.image}
                          className="aspect-[4/5] w-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                          aria-hidden
                          onError={() =>
                            setFailedMedia((prev) => ({ ...prev, [item.id]: true }))
                          }
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-ink/25">
                          <Play className="h-12 w-12 text-white" />
                        </span>
                      </div>
                    )
                  ) : failedMedia[item.id] ? (
                    <div className="flex aspect-[4/5] items-center justify-center bg-brand-50 text-sm text-muted">
                      Imagen no disponible
                    </div>
                  ) : (
                    <img
                      src={item.image}
                      alt={
                        item.category === 'Pacientes'
                          ? 'Paciente atendido en EcoVet Clínica Veterinaria'
                          : 'Instalaciones de EcoVet Clínica Veterinaria'
                      }
                      className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={() =>
                        setFailedMedia((prev) => ({ ...prev, [item.id]: true }))
                      }
                    />
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 text-left text-sm font-semibold text-white">
                    {item.title}
                  </span>
                </button>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      <Lightbox
        open={!!active}
        src={active?.image || ''}
        alt={active?.title || ''}
        type={active?.type}
        onClose={() => setActive(null)}
      />
    </>
  )
}
