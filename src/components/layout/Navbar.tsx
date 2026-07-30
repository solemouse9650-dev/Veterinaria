import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Menu, MessageCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'
import { useSite } from '@/contexts/SiteContext'
import { cn, whatsappUrl } from '@/lib/utils'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/especialidades', label: 'Especialidades' },
  { to: '/equipo', label: 'Equipo' },
  { to: '/galeria', label: 'Galería' },
  { to: '/blog', label: 'Blog' },
  { to: '/preguntas-frecuentes', label: 'FAQ' },
  { to: '/contacto', label: 'Contacto' },
]

export function Navbar() {
  const { site } = useSite()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-line/80 bg-white/90 shadow-sm backdrop-blur-xl'
          : 'bg-transparent',
      )}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <Link
          to="/"
          className="group focus-ring rounded-full transition hover:opacity-90"
          aria-label="EcoVet — Ir al inicio"
        >
          <Logo
            showWordmark
            imgClassName="h-12 w-12 transition duration-300 group-hover:scale-105"
          />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Principal">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-2.5 py-2 text-sm font-medium transition hover:text-brand-700',
                  isActive ? 'text-brand-700' : 'text-muted',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={whatsappUrl(site.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring rounded-xl"
          >
            <Button variant="whatsapp" size="sm" type="button">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </a>
          <Link to="/reservas" className="focus-ring rounded-xl">
            <Button size="sm">
              <CalendarDays className="h-4 w-4" />
              Reservar turno
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="rounded-xl border border-line bg-white/80 p-2.5 text-ink focus-ring xl:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-line bg-white xl:hidden"
          >
            <nav className="container-page flex flex-col gap-1 py-4" aria-label="Móvil">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-3 py-3 text-base font-medium',
                      isActive ? 'bg-brand-50 text-brand-800' : 'text-ink',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-3 grid gap-2">
                <Link to="/reservas" onClick={() => setOpen(false)}>
                  <Button className="w-full">Reservar turno</Button>
                </Link>
                <a
                  href={whatsappUrl(site.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="whatsapp" className="w-full">
                    WhatsApp
                  </Button>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
