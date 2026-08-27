import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { WhatsAppIcon } from '@/components/brand/SocialIcons'
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
  { to: '/contacto', label: 'Contacto' },
]

export function Navbar() {
  const { site } = useSite()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1280) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-all duration-300',
        scrolled || open
          ? 'border-b border-line/80 bg-white/95 shadow-sm backdrop-blur-xl'
          : 'bg-transparent',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-2 sm:h-[72px] sm:gap-4">
        <Link
          to="/"
          className="group min-w-0 focus-ring rounded-full transition hover:opacity-90"
          aria-label="EcoVet — Ir al inicio"
          onClick={() => setOpen(false)}
        >
          <Logo
            showWordmark
            imgClassName="transition duration-300 group-hover:scale-105"
          />
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Principal">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-2 py-2 text-[13px] font-medium transition hover:text-brand-700 2xl:px-2.5 2xl:text-sm',
                  isActive ? 'text-brand-700' : 'text-muted',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/reservas" className="hidden focus-ring rounded-xl sm:inline-flex lg:hidden">
            <Button size="sm">Reservar</Button>
          </Link>
          <div className="hidden items-center gap-2 lg:flex">
            <a
              href={whatsappUrl(site.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded-xl"
            >
              <Button variant="whatsapp" size="sm" type="button">
                <WhatsAppIcon className="h-4 w-4" />
                <span className="hidden xl:inline">WhatsApp</span>
              </Button>
            </a>
            <Link to="/reservas" className="focus-ring rounded-xl">
              <Button size="sm">
                <CalendarDays className="h-4 w-4" />
                <span className="hidden xl:inline">Reservar turno</span>
                <span className="xl:hidden">Reservar</span>
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className="rounded-xl border border-line bg-white/90 p-2.5 text-ink focus-ring xl:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-16 z-40 bg-ink/40 backdrop-blur-[2px] xl:hidden sm:top-[72px]"
            onClick={() => setOpen(false)}
          >
            <motion.nav
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-white shadow-xl safe-bottom sm:max-h-[calc(100dvh-4.5rem)]"
              aria-label="Móvil"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="container-page flex flex-col gap-1 py-4">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'rounded-xl px-3 py-3.5 text-base font-medium',
                        isActive ? 'bg-brand-50 text-brand-800' : 'text-ink',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="mt-3 grid gap-2 pb-2">
                  <Link to="/reservas" onClick={() => setOpen(false)}>
                    <Button className="w-full" size="lg">
                      <CalendarDays className="h-4 w-4" />
                      Reservar turno
                    </Button>
                  </Link>
                  <a
                    href={whatsappUrl(site.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                  >
                    <Button variant="whatsapp" className="w-full" size="lg">
                      <WhatsAppIcon className="h-4 w-4" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
