import {
  Clock3,
  Mail,
  MapPin,
  Phone,
  Share2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { useSite } from '@/contexts/SiteContext'
import { sanitizeHttpUrl } from '@/lib/sanitize'
import { whatsappUrl } from '@/lib/utils'

export function Footer() {
  const { site, hours, services } = useSite()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-ink text-white pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] sm:pb-0">
      <div className="container-page section-pad grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Logo imgClassName="h-16 w-16 ring-white/25" />
            <div>
              <p className="font-display text-2xl font-bold tracking-tight text-white">
                EcoVet
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-200">
                Clínica Veterinaria
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            {site.tagline}. Atención veterinaria integral con enfoque preventivo y
            trato humano.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { href: site.social.facebook, label: 'Facebook' },
              { href: site.social.instagram, label: 'Instagram' },
              { href: site.social.youtube, label: 'YouTube' },
            ].map((item) => {
              const href = sanitizeHttpUrl(item.href)
              if (!href) return null
              return (
                <a
                  key={item.label}
                  href={href}
                  aria-label={item.label}
                  className="rounded-full bg-white/10 p-2 hover:bg-brand-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Share2 className="h-4 w-4" />
                </a>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-200">
            Servicios
          </p>
          <ul className="space-y-2 text-sm text-white/75">
            {services.slice(0, 7).map((s) => (
              <li key={s.id}>
                <Link to={`/servicios/${s.slug}`} className="hover:text-white">
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/servicios" className="text-brand-200 hover:text-white">
                Ver todos
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-200">
            Contacto
          </p>
          <ul className="space-y-3 text-sm text-white/75">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
              {site.address}, {site.city}
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
              <a href={`tel:${site.phone}`}>{site.phone}</a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <a
                href={whatsappUrl(site.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-200 hover:text-white"
              >
                WhatsApp directo
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-200">
            Horarios
          </p>
          <ul className="space-y-2 text-sm text-white/75">
            {hours.regular.map((d) => (
              <li key={d.day} className="flex items-start gap-2">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                <span>
                  {d.day}:{' '}
                  {d.closed ? 'Cerrado' : `${d.open} – ${d.close}`}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-brand-100">
            {hours.emergencyNote}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-5 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/terminos-y-condiciones" className="hover:text-white">
              Términos y condiciones
            </Link>
            <Link to="/politica-de-privacidad" className="hover:text-white">
              Privacidad
            </Link>
            <Link to="/politica-de-cookies" className="hover:text-white">
              Cookies
            </Link>
            <Link to="/aviso-legal" className="hover:text-white">
              Aviso legal
            </Link>
            <Link to="/preguntas-frecuentes" className="hover:text-white">
              Preguntas frecuentes
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
