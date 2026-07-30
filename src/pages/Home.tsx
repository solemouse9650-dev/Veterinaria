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
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Button } from '@/components/ui/Button'
import { Counter } from '@/components/ui/Counter'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ServiceCard } from '@/components/services/ServiceCard'
import { Accordion } from '@/components/ui/Accordion'
import { useSite } from '@/contexts/SiteContext'
import { whatsappUrl } from '@/lib/utils'

export function Home() {
  const { site, hero, services, testimonials, faqs, team } = useSite()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 140])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.35])

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
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-brand-900/35" />
        </motion.div>

        <motion.div
          style={{ opacity }}
          className="relative container-page flex min-h-[100svh] flex-col justify-center pb-16 pt-28"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <img
              src="/logo.png"
              alt="EcoVet Clínica Veterinaria"
              className="h-28 w-28 rounded-full object-cover shadow-2xl ring-4 ring-white/25 md:h-36 md:w-36"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl font-display text-5xl font-bold tracking-tight leading-none text-white md:text-7xl lg:text-8xl"
          >
            EcoVet
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mt-3 text-sm font-medium uppercase tracking-[0.28em] text-brand-200"
          >
            Clínica Veterinaria
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-2xl font-display text-xl font-semibold text-white md:text-2xl"
          >
            {hero.title}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mt-4 max-w-xl text-lg leading-relaxed text-white/80"
          >
            {hero.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/reservas">
              <Button size="lg">
                <CalendarDays className="h-5 w-5" />
                {hero.ctaPrimary}
              </Button>
            </Link>
            <a href={whatsappUrl(site.whatsapp)} target="_blank" rel="noreferrer">
              <Button size="lg" variant="whatsapp">
                <MessageCircle className="h-5 w-5" />
                {hero.ctaSecondary}
              </Button>
            </a>
            <Link to="/servicios">
              <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-ink">
                {hero.ctaTertiary}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="grid gap-5 md:grid-cols-3">
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
                <div className="h-full rounded-3xl border border-line bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-900/5">
                  <item.icon className="h-10 w-10 text-brand-600" />
                  <h3 className="mt-5 font-display text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-muted leading-relaxed">{item.text}</p>
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services
              .filter((s) => s.featured)
              .slice(0, 6)
              .map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/servicios">
              <Button size="lg" variant="secondary">
                Ver todos los servicios
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <AnimatedSection>
            <div className="overflow-hidden rounded-[2rem]">
              <img
                src="https://images.unsplash.com/photo-1576201832337-cebc1a8c8d0d?auto=format&fit=crop&w=1400&q=80"
                alt="Equipo veterinario de EcoVet en consulta"
                className="h-full w-full object-cover"
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
            <div className="grid gap-4 sm:grid-cols-2">
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
            <Link to="/nosotros" className="mt-6 inline-block">
              <Button variant="outline">Conocer EcoVet</Button>
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <AnimatedSection key={member.id} delay={i * 0.06}>
                <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="aspect-[4/5] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <h3 className="font-display text-lg font-semibold">{member.name}</h3>
                    <p className="mt-1 text-sm text-brand-200">{member.specialty}</p>
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
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.id} delay={i * 0.05}>
                <article className="h-full rounded-3xl border border-line bg-white p-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{t.name}</p>
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
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Resolvemos tus dudas antes de venir"
            description="Si necesitás una respuesta inmediata, escribinos por WhatsApp."
          />
          <Accordion items={faqs.slice(0, 5)} />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-800 via-brand-600 to-brand-500 px-8 py-14 text-center text-white md:px-16">
          <AnimatedSection>
            <img
              src="/logo.png"
              alt=""
              aria-hidden
              className="mx-auto mb-6 h-16 w-16 rounded-full object-cover ring-2 ring-white/30"
            />
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
              Reservá el turno de tu mascota hoy
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/85">
              Completá el formulario online o escribinos por WhatsApp. Te confirmamos
              disponibilidad en minutos.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/reservas">
                <Button size="lg" className="bg-white text-brand-800 hover:bg-brand-50">
                  Reservar turno
                </Button>
              </Link>
              <a href={whatsappUrl(site.whatsapp)} target="_blank" rel="noreferrer">
                <Button size="lg" variant="secondary">
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
