import { SEO } from '@/components/seo/SEO'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TeamMemberCard } from '@/components/team/TeamMemberCard'
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
              <TeamMemberCard key={member.id} member={member} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
