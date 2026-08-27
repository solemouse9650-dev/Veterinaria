import { SEO } from '@/components/seo/SEO'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ClinicShowcase } from '@/components/media/ClinicShowcase'
import { TeamMemberCard } from '@/components/team/TeamMemberCard'
import { CLINIC_PHOTOS } from '@/data/media'
import { useSite } from '@/contexts/SiteContext'

export function About() {
  const { site, team } = useSite()

  return (
    <>
      <SEO
        title="Nosotros"
        description={`Conocé la historia, misión y valores de ${site.name}.`}
        path="/nosotros"
      />
      <section className="relative overflow-hidden page-top">
        <div className="absolute inset-0">
          <img
            src={CLINIC_PHOTOS[1].src}
            alt={CLINIC_PHOTOS[1].alt}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-ink/70" />
        </div>
        <div className="relative container-page py-14 sm:py-20 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200 sm:text-sm">
            Sobre nosotros
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold text-white sm:text-4xl md:text-6xl">
            {site.name} Clínica Veterinaria
          </h1>
          <p className="mt-4 max-w-2xl whitespace-pre-line text-sm text-white/80 sm:mt-5 sm:text-lg">
            {site.mission}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <AnimatedSection>
            <SectionHeading
              align="left"
              eyebrow="Nuestra historia"
              title="Nuestra historia"
              description={site.history}
            />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              <img
                src={CLINIC_PHOTOS[7].src}
                alt={CLINIC_PHOTOS[7].alt}
                className="h-56 w-full rounded-3xl object-cover sm:h-72"
                loading="lazy"
              />
              <img
                src={CLINIC_PHOTOS[4].src}
                alt={CLINIC_PHOTOS[4].alt}
                className="h-56 w-full rounded-3xl object-cover sm:mt-10 sm:h-72"
                loading="lazy"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Nuestra veterinaria"
            title="Un espacio pensado para cuidar"
            description="Instalaciones limpias, equipadas y cercanas, en Suipacha 250, Apóstoles."
          />
          <ClinicShowcase />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <SectionHeading
            eyebrow="Nuestros valores"
            title="Nuestros valores"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {site.values.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 0.06}>
                <article className="h-full rounded-3xl border border-line bg-canvas p-6">
                  <p className="font-display text-xl font-semibold text-brand-800">
                    {value.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {value.description}
                  </p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Equipo"
            title="Equipo"
            description={site.commitment}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <TeamMemberCard key={member.id} member={member} delay={i * 0.05} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
