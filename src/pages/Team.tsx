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
        description="Conocé al equipo de EcoVet Clínica Veterinaria en Apóstoles, Misiones."
        path="/equipo"
      />
      <section className="section-pad page-top">
        <div className="container-page">
          <SectionHeading
            eyebrow="Equipo"
            title="Equipo"
            description="Profesionales de EcoVet Clínica Veterinaria."
          />
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <AnimatedSection key={member.id} delay={i * 0.06}>
                <article className="grid overflow-hidden rounded-[1.5rem] border border-line bg-white sm:rounded-[2rem]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="mx-auto h-40 w-40 object-contain p-6 sm:h-48 sm:w-48"
                  />
                  <div className="p-4 text-center sm:p-6">
                    <h2 className="font-display text-xl font-semibold sm:text-2xl">
                      {member.name}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-brand-700">
                      {member.specialty}
                    </p>
                    {member.experience && (
                      <p className="mt-3 text-sm text-muted">
                        <span className="font-semibold text-ink">Experiencia:</span>{' '}
                        {member.experience}
                      </p>
                    )}
                    {member.schedule && (
                      <p className="mt-1 text-sm text-muted">
                        <span className="font-semibold text-ink">Horarios:</span>{' '}
                        {member.schedule}
                      </p>
                    )}
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
