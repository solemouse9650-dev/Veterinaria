import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { SEO } from '@/components/seo/SEO'

export function NotFound() {
  return (
    <>
      <SEO title="Página no encontrada" path="/404" />
      <section className="container-page flex min-h-[70vh] flex-col items-center justify-center pt-28 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          Error 404
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
          No encontramos esta página
        </h1>
        <p className="mt-4 max-w-md text-muted">
          Puede que el enlace haya cambiado. Volvé al inicio o reservá un turno.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to="/">
            <Button>Ir al inicio</Button>
          </Link>
          <Link to="/reservas">
            <Button variant="outline">Reservar turno</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
