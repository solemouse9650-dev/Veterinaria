import { CalendarDays, Clock3, MessageCircle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { SEO } from '@/components/seo/SEO'
import { Button } from '@/components/ui/Button'
import { useSite } from '@/contexts/SiteContext'
import { formatPrice, whatsappUrl } from '@/lib/utils'

export function ServiceDetail() {
  const { slug } = useParams()
  const { services, site } = useSite()
  const service = services.find((s) => s.slug === slug)

  if (!service) {
    return (
      <section className="container-page section-pad page-top text-center">
        <h1 className="font-display text-3xl font-semibold">Servicio no encontrado</h1>
        <Link to="/servicios" className="mt-6 inline-block">
          <Button>Volver a servicios</Button>
        </Link>
      </section>
    )
  }

  return (
    <>
      <SEO
        title={service.name}
        description={service.description}
        path={`/servicios/${service.slug}`}
        image={service.image}
      />
      <section className="section-pad page-top">
        <div className="container-page grid gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
            <img
              src={service.image}
              alt={service.name}
              className="aspect-[16/11] h-full w-full object-cover sm:aspect-auto sm:min-h-[360px]"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 sm:text-sm">
              {service.category}
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
              {service.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {service.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="rounded-2xl border border-line bg-white px-5 py-4">
                <p className="text-sm text-muted">Precio de referencia</p>
                <p className="font-display text-2xl font-semibold text-brand-700">
                  {formatPrice(service.price)}
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-white px-5 py-4">
                <p className="text-sm text-muted">Duración estimada</p>
                <p className="inline-flex items-center gap-2 font-display text-2xl font-semibold">
                  <Clock3 className="h-5 w-5 text-brand-600" />
                  {service.duration} min
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
              <Link to={`/reservas?servicio=${service.slug}`} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  <CalendarDays className="h-5 w-5" />
                  Reservar este servicio
                </Button>
              </Link>
              <a
                href={whatsappUrl(
                  site.whatsapp,
                  `Hola EcoVet, quiero consultar por el servicio de ${service.name}.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" variant="whatsapp" className="w-full sm:w-auto">
                  <MessageCircle className="h-5 w-5" />
                  Consultar por WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
