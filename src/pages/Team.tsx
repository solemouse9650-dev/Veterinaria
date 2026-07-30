import { SEO } from '@/components/seo/SEO'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useSite } from '@/contexts/SiteContext'

export function Team() {
  const { team } = useSite()

  return (
    <>
      <SEO
        title="Equipo"
        description="Conocé al equipo veterinario de EcoVet: experiencia, especialidades y horarios."
        path="/equipo"
      />
      <section className="section-pad pt-32">
        <div className="container-page">
          <SectionHeading
            eyebrow="Equipo veterinario"
            title="Profesionales con vocación y experiencia"
            description="Cada integrante aporta una mirada especializada para un cuidado integral."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {team.map((member, i) => (
              <AnimatedSection key={member.id} delay={i * 0.06}>
                <article className="grid overflow-hidden rounded-[2rem] border border-line bg-white sm:grid-cols-[220px_1fr]">
                  <img
                    src={member.image}
                    alt={`Foto de ${member.name}`}
                    className="h-64 w-full object-cover sm:h-full"
                  />
                  <div className="p-6">
                    <h2 className="font-display text-2xl font-semibold">{member.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-brand-700">
                      {member.specialty}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {member.description}
                    </p>
                    <div className="mt-4 space-y-1 text-sm">
                      <p>
                        <span className="font-semibold text-ink">Experiencia:</span>{' '}
                        <span className="text-muted">{member.experience}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Horarios:</span>{' '}
                        <span className="text-muted">{member.schedule}</span>
                      </p>
                    </div>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
