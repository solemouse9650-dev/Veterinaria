import { Link } from 'react-router-dom'
import { SEO } from '@/components/seo/SEO'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useSite } from '@/contexts/SiteContext'

export function Specialties() {
  const { specialties } = useSite()

  return (
    <>
      <SEO
        title="Especialidades"
        description="Atención veterinaria para perros, gatos, animales exóticos, de granja y urgencias."
        path="/especialidades"
      />
      <section className="section-pad page-top">
        <div className="container-page">
          <SectionHeading
            eyebrow="Especialidades"
            title="Cuidado especializado por especie y necesidad"
            description="Adaptamos protocolos, ambiente y comunicación según el paciente."
          />
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {specialties.map((item, i) => (
              <AnimatedSection key={item.id} delay={i * 0.05}>
                <article className="grid overflow-hidden rounded-[1.5rem] border border-line bg-white sm:rounded-[2rem] md:grid-cols-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full object-cover sm:h-56 md:h-full"
                  />
                  <div className="flex flex-col justify-center p-4 sm:p-6">
                    <h2 className="font-display text-xl font-semibold sm:text-2xl">
                      {item.name}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted sm:mt-3">
                      {item.description}
                    </p>
                    <ul className="mt-3 space-y-1 text-sm text-brand-800 sm:mt-4">
                      {item.features.map((f) => (
                        <li key={f}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
          <div className="mt-8 text-center sm:mt-10">
            <Link to="/reservas" className="inline-block w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Reservar turno especializado
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
