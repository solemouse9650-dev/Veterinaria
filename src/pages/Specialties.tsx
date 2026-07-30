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
      <section className="section-pad pt-32">
        <div className="container-page">
          <SectionHeading
            eyebrow="Especialidades"
            title="Cuidado especializado por especie y necesidad"
            description="Adaptamos protocolos, ambiente y comunicación según el paciente."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {specialties.map((item, i) => (
              <AnimatedSection key={item.id} delay={i * 0.05}>
                <article className="grid overflow-hidden rounded-[2rem] border border-line bg-white md:grid-cols-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-56 w-full object-cover md:h-full"
                  />
                  <div className="flex flex-col justify-center p-6">
                    <h2 className="font-display text-2xl font-semibold">{item.name}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>
                    <ul className="mt-4 space-y-1 text-sm text-brand-800">
                      {item.features.map((f) => (
                        <li key={f}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/reservas">
              <Button size="lg">Reservar turno especializado</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
