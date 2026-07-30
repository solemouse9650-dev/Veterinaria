import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  CalendarDays,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/seo/SEO'
import { ServiceCard } from '@/components/services/ServiceCard'
import { Accordion } from '@/components/ui/Accordion'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Button } from '@/components/ui/Button'
import { Counter } from '@/components/ui/Counter'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useSite } from '@/contexts/SiteContext'
import { whatsappUrl } from '@/lib/utils'

export function Home() {
  const { site, hero, services, testimonials, faqs, team } = useSite()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.4])

  return (
    <>
      <SEO
        title="Inicio"
        description={site.description}
        path="/"
        image={hero.image}
      />

      <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0">
          <img
            src={hero.image}
            alt="Veterinaria profesional atendiendo mascotas en EcoVet"
            className="h-full w-full object-cover object-[center_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/70 to-brand-900/50 md:bg-gradient-to-r md:from-ink/90 md:via-ink/70 md:to-brand-900/35" />
        </motion.div>

        <motion.div
          style={{ opacity }}
          className="relative container-page flex min-h-[100svh] flex-col justify-end pb-10 pt-24 sm:justify-center sm:pb-16 sm:pt-28"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6"
          >
            <img
              src="/logo.png"
              alt="EcoVet Clínica Veterinaria"
              className="h-20 w-20 rounded-full object-cover shadow-2xl ring-4 ring-white/25 sm:h-28 sm:w-28 md:h-36 md:w-36"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl font-display text-4xl font-bold tracking-tight leading-none text-white sm:text-5xl md:text-7xl lg:text-8xl"
          >
            EcoVet
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mt-2 text-[11px] font-medium uppercase tracking-[0.22em] text-brand-200 sm:mt-3 sm:text-sm sm:tracking-[0.28em]"
          >
            Clínica Veterinaria
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-2xl font-display text-lg font-semibold text-white sm:mt-6 sm:text-xl md:text-2xl"
          >
            {hero.title}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:mt-4 sm:text-base md:text-lg"
          >
            {hero.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36 }}
            className="mt-6 flex w-full flex-col gap-2.5 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3"
          >
            <Link to="/reservas" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                <CalendarDays className="h-5 w-5" />
                {hero.ctaPrimary}
              </Button>
            </Link>
            <a
              href={whatsappUrl(site.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="lg" variant="whatsapp" className="w-full sm:w-auto">
                <MessageCircle className="h-5 w-5" />
                <span className="truncate">{hero.ctaSecondary}</span>
              </Button>
            </a>
            <Link to="/servicios" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/30 bg-white/10 text-white hover:bg-white hover:text-ink sm:w-auto"
              >
                {hero.ctaTertiary}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-14 sm:gap-3 lg:grid-cols-4">
            {hero.stats.map((stat) => (
              <Counter key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </motion.div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <SectionHeading
            eyebrow="Por qué elegirnos"
            title="Confianza clínica con cercanía humana"
            description="Un centro veterinario pensado para tutores exigentes: protocolos claros, instalaciones modernas y comunicación transparente."
          />
          <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Medicina preventiva',
                text: 'Planes de vacunación, controles y nutrición para anticipar problemas.',
              },
              {
                icon: Stethoscope,
                title: 'Diagnóstico integral',
                text: 'Laboratorio, ecografía y radiología digital en un mismo lugar.',
              },
              {
                icon: HeartHandshake,
                title: 'Acompañamiento real',
                text: 'Seguimiento por WhatsApp y explicaciones claras en cada etapa.',
              },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-line bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-900/5 sm:p-7">
                  <item.icon className="h-9 w-9 text-brand-600 sm:h-10 sm:w-10" />
                  <h3 className="mt-4 font-display text-lg font-semibold sm:mt-5 sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                    {item.text}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Servicios"
            title="Todo lo que tu mascota necesita"
            description="Desde la consulta preventiva hasta cirugías y estética, con precios de referencia y turnos online."
          />
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {services
              .filter((s) => s.featured)
              .slice(0, 6)
              .map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
          </div>
          <div className="mt-8 text-center sm:mt-10">
            <Link to="/servicios">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Ver todos los servicios
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <AnimatedSection>
            <div className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
              <img
                src="https://images.unsplash.com/photo-1576201832337-cebc1a8c8d0d?auto=format&fit=crop&w=1400&q=80"
                alt="Equipo veterinario de EcoVet en consulta"
                className="aspect-[4/3] h-full w-full object-cover lg:aspect-auto lg:min-h-[420px]"
              />
            </div>
          </AnimatedSection>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Sobre nosotros"
              title={`Más de ${site.yearsExperience} años cuidando historias de vida`}
              description={site.history.slice(0, 220) + '…'}
            />
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {site.values.slice(0, 4).map((value) => (
                <div
                  key={value.title}
                  className="rounded-2xl border border-line bg-white p-4"
                >
                  <p className="font-semibold text-brand-800">{value.title}</p>
                  <p className="mt-1 text-sm text-muted">{value.description}</p>
                </div>
              ))}
            </div>
            <Link to="/nosotros" className="mt-6 inline-block w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                Conocer EcoVet
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-900 text-white">
        <div className="container-page">
          <SectionHeading
            light
            eyebrow="Equipo"
            title="Veterinarios que inspiran confianza"
            description="Profesionales con formación continua y vocación por el bienestar animal."
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {team.map((member, i) => (
              <AnimatedSection key={member.id} delay={i * 0.06}>
                <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:rounded-3xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="aspect-[4/5] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-3 sm:p-4">
                    <h3 className="font-display text-sm font-semibold sm:text-lg">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-xs text-brand-200 sm:text-sm">
                      {member.specialty}
                    </p>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <SectionHeading
            eyebrow="Testimonios"
            title="Familias que confían en EcoVet"
            description="Opiniones reales de tutores que eligieron una clínica cercana y profesional."
          />
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.id} delay={i * 0.05}>
                <article className="h-full rounded-3xl border border-line bg-white p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="h-11 w-11 rounded-full object-cover sm:h-12 sm:w-12"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{t.name}</p>
                      <p className="text-sm text-muted">Tutor de {t.petName}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-amber-500" aria-label={`${t.rating} estrellas`}>
                    {'★'.repeat(t.rating)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">“{t.comment}”</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page grid gap-8 lg:grid-cols-2 lg:gap-10">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Resolvemos tus dudas antes de venir"
            description="Si necesitás una respuesta inmediata, escribinos por WhatsApp."
          />
          <Accordion items={faqs.slice(0, 5)} />
        </div>
      </section>

      <section className="section-pad pb-[calc(clamp(2.75rem,5.5vw,6rem)+4rem)] sm:pb-[clamp(2.75rem,5.5vw,6rem)]">
        <div className="container-page overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-brand-800 via-brand-600 to-brand-500 px-5 py-10 text-center text-white sm:rounded-[2rem] sm:px-8 sm:py-14 md:px-16">
          <AnimatedSection>
            <img
              src="/logo.png"
              alt=""
              aria-hidden
              className="mx-auto mb-5 h-14 w-14 rounded-full object-cover ring-2 ring-white/30 sm:mb-6 sm:h-16 sm:w-16"
            />
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl">
              Reservá el turno de tu mascota hoy
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85 sm:mt-4 sm:text-base">
              Completá el formulario online o escribinos por WhatsApp. Te confirmamos
              disponibilidad en minutos.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
              <Link to="/reservas" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-white text-brand-800 hover:bg-brand-50 sm:w-auto"
                >
                  Reservar turno
                </Button>
              </Link>
              <a
                href={whatsappUrl(site.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  WhatsApp
                </Button>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
