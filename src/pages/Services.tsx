import { useMemo, useState } from 'react'
import { SEO } from '@/components/seo/SEO'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ServiceCard } from '@/components/services/ServiceCard'
import { useSite } from '@/contexts/SiteContext'
import { cn } from '@/lib/utils'

export function Services() {
  const { services } = useSite()
  const categories = useMemo(
    () => ['Todos', ...Array.from(new Set(services.map((s) => s.category)))],
    [services],
  )
  const [active, setActive] = useState('Todos')
  const filtered =
    active === 'Todos'
      ? services
      : services.filter((s) => s.category === active)

  return (
    <>
      <SEO
        title="Servicios"
        description="Consultas, vacunación, cirugías, diagnóstico, emergencias, peluquería y más en EcoVet."
        path="/servicios"
      />
      <section className="section-pad pt-32">
        <div className="container-page">
          <SectionHeading
            eyebrow="Servicios"
            title="Un menú completo de cuidado veterinario"
            description="Cada servicio incluye descripción, precio de referencia, duración estimada y reserva online."
          />
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition focus-ring',
                  active === cat
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-muted border border-line hover:border-brand-400',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
