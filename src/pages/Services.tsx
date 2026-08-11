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
        description="Clínica general, vacunaciones, ecografía, radiografía digital, cirugías de tejidos blandos, cardiología, odontología y más en EcoVet Apóstoles. No se realizan urgencias."
        path="/servicios"
      />
      <section className="section-pad page-top">
        <div className="container-page">
          <SectionHeading
            eyebrow="Servicios"
            title="Nuestros servicios"
            description="Servicios de atención veterinaria integral en EcoVet Clínica Veterinaria."
          />
          <div className="mb-8 rounded-2xl border-2 border-brand-500 bg-brand-50 px-5 py-5 text-center">
            <p className="font-display text-xl font-bold text-brand-800 sm:text-2xl">
              No se realizan urgencias.
            </p>
          </div>
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
