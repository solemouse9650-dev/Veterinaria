import {
  CalendarDays,
  FileText,
  HelpCircle,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  PawPrint,
  Settings,
  Stethoscope,
  Clock3,
  Sparkles,
  Users,
  Database,
} from 'lucide-react'
import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'
import { seedDatabase } from '@/services/firestore'
import { useState } from 'react'
import { useSite } from '@/contexts/SiteContext'

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

  return (
    <div className="min-h-screen bg-[#f3f7f6] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="bg-ink text-white lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600">
            <PawPrint className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold">EcoVet Admin</p>
            <p className="text-xs text-white/55">Panel de gestión</p>
          </div>
        </div>
        <nav className="space-y-1 p-3" aria-label="Admin">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white',
                )
              }
            >
              <link.icon className="h-4 w-4" />
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
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-line bg-white/90 px-5 py-4 backdrop-blur md:px-8">
          <p className="text-sm text-muted">Sesión activa</p>
          <p className="font-semibold text-ink">{user.email}</p>
        </header>
        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
