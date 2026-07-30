import { Play } from 'lucide-react'
import { useState } from 'react'
import { SEO } from '@/components/seo/SEO'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Lightbox } from '@/components/ui/Lightbox'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useSite } from '@/contexts/SiteContext'
import type { GalleryItem } from '@/types'

export function Gallery() {
  const { gallery } = useSite()
  const [active, setActive] = useState<GalleryItem | null>(null)

  return (
    <>
      <SEO
        title="Galería"
        description="Recorrido visual por instalaciones, pacientes y momentos EcoVet."
        path="/galeria"
      />
      <section className="section-pad page-top">
        <div className="container-page">
          <SectionHeading
            eyebrow="Instalaciones"
            title="Una clínica moderna, luminosa y cálida"
            description="Explorá nuestra galería con lightbox y videos del espacio."
          />
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {gallery.map((item, i) => (
              <AnimatedSection key={item.id} delay={i * 0.04} className="mb-4 break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setActive(item)}
                  className="group relative w-full overflow-hidden rounded-3xl focus-ring"
                >
                  {item.type === 'video' ? (
                    <div className="flex aspect-video items-center justify-center bg-brand-900 text-white">
                      <Play className="h-12 w-12" />
                    </div>
                  ) : (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
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
