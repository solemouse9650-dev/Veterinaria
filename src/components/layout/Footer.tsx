import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from '@/components/brand/SocialIcons'
import { OpenStatusBadge } from '@/components/hours/OpenStatusBadge'
import { useSite } from '@/contexts/SiteContext'
import { sanitizeHttpUrl } from '@/lib/sanitize'
import { whatsappUrl } from '@/lib/utils'

export function Footer() {
  const { site, hours, services } = useSite()
  const year = new Date().getFullYear()
  const facebook = sanitizeHttpUrl(site.social.facebook)
  const instagram = sanitizeHttpUrl(site.social.instagram)

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
          <Link
            to="/telemedicina"
            className="mt-4 inline-block text-sm font-medium text-brand-200 hover:text-white"
          >
            Telemedicina veterinaria online
          </Link>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {facebook ? (
              <a
                href={facebook}
                aria-label="Facebook de EcoVet"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white transition hover:opacity-90"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            ) : null}
            {instagram ? (
              <a
                href={instagram}
                aria-label="Instagram de EcoVet"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(45deg,#f58529,#dd2a7b,#8134af)] text-white transition hover:opacity-90"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            ) : null}
            <a
              href={whatsappUrl(site.whatsapp)}
              aria-label="WhatsApp de EcoVet"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:opacity-90"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
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
                className="inline-flex items-center gap-2 text-brand-200 hover:text-white"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp directo
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-200">
            Horarios
          </p>
          <OpenStatusBadge hours={hours} variant="dark" className="mb-3" />
          <ul className="space-y-2 text-sm text-white/75">
            {hours.regular.map((d) => (
              <li key={d.day} className="flex items-start gap-2">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                <span>
                  {d.day}: {d.closed ? 'Cerrado' : `${d.open} – ${d.close}`}
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
        <div className="container-page py-5 text-sm text-white/55">
          <p>
            © {year} {site.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
