import { Link } from 'react-router-dom'
import { SEO } from '@/components/seo/SEO'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useSite } from '@/contexts/SiteContext'
import { whatsappUrl } from '@/lib/utils'

export function FAQPage() {
  const { faqs, site } = useSite()

  return (
    <>
      <SEO
        title="Preguntas frecuentes"
        description="Respuestas sobre turnos, emergencias, castraciones, pagos y atención de animales exóticos."
        path="/preguntas-frecuentes"
      />
      <section className="section-pad pt-32">
        <div className="container-page max-w-3xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Preguntas frecuentes"
            description="Si no encontrás tu respuesta, escribinos y te ayudamos al instante."
          />
          <Accordion items={faqs} />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/reservas">
              <Button>Reservar turno</Button>
            </Link>
            <a href={whatsappUrl(site.whatsapp)} target="_blank" rel="noreferrer">
              <Button variant="whatsapp">Consultar por WhatsApp</Button>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
