import {
  CalendarDays,
  Clock3,
  Database,
  FileText,
  HelpCircle,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Settings,
  Sparkles,
  Stethoscope,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/contexts/AuthContext'
import { useSite } from '@/contexts/SiteContext'
import { cn } from '@/lib/utils'
import { seedDatabase } from '@/services/firestore'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/reservas', label: 'Reservas', icon: CalendarDays },
  { to: '/admin/servicios', label: 'Servicios', icon: Stethoscope },
  { to: '/admin/equipo', label: 'Equipo', icon: Users },
  { to: '/admin/galeria', label: 'Galería', icon: ImageIcon },
  { to: '/admin/blog', label: 'Blog', icon: FileText },
  { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { to: '/admin/horarios', label: 'Horarios', icon: Clock3 },
  { to: '/admin/hero', label: 'Hero', icon: Sparkles },
  { to: '/admin/testimonios', label: 'Testimonios', icon: MessageSquareQuote },
  { to: '/admin/sitio', label: 'Sitio', icon: Settings },
]

export function AdminLayout() {
  const { user, loading, isAdmin, logout } = useAuth()
  const { refresh } = useSite()
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  const handleSeed = async () => {
    setSeeding(true)
    setSeedMsg('')
    try {
      await seedDatabase()
      await refresh()
      setSeedMsg('Contenido demo cargado en Firestore.')
    } catch (e) {
      setSeedMsg(
        e instanceof Error
          ? e.message
          : 'No se pudo sembrar. Revisá las reglas de Firebase.',
      )
    } finally {
      setSeeding(false)
    }
  }

  const Sidebar = (
    <>
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <img
          src="/logo.png"
          alt="EcoVet"
          className="h-11 w-11 rounded-full object-cover ring-1 ring-white/20"
        />
        <div className="min-w-0">
          <p className="font-display text-lg font-bold tracking-tight">EcoVet Admin</p>
          <p className="text-xs uppercase tracking-[0.14em] text-white/55">
            Panel de gestión
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white',
              )
            }
          >
            <link.icon className="h-4 w-4 shrink-0" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-2 border-t border-white/10 p-4">
        <button
          type="button"
          onClick={() => void handleSeed()}
          disabled={seeding}
          className="flex w-full items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm hover:bg-white/15 disabled:opacity-60"
        >
          <Database className="h-4 w-4" />
          {seeding ? 'Cargando demo…' : 'Cargar datos demo'}
        </button>
        {seedMsg && <p className="text-xs text-brand-200">{seedMsg}</p>}
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[#f3f7f6] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden bg-ink text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-hidden">
        {Sidebar}
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/50"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(288px,88vw)] flex-col bg-ink text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="text-sm font-semibold">Menú</p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg p-2 hover:bg-white/10"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {Sidebar}
          </aside>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-white/95 px-4 py-3 backdrop-blur sm:px-5 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-line p-2 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú admin"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="text-xs text-muted sm:text-sm">Sesión activa</p>
              <p className="truncate font-semibold text-ink text-sm sm:text-base">
                {user.email}
              </p>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
