import { Link } from 'react-router-dom'
import { SEO } from '@/components/seo/SEO'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <>
      <SEO title="Página no encontrada" path="/404" />
      <section className="container-page flex min-h-[70vh] flex-col items-center justify-center page-top px-2 pb-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          Error 404
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
          No encontramos esta página
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted sm:text-base">
          Puede que el enlace haya cambiado. Volvé al inicio o reservá un turno.
        </p>
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Link to="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Ir al inicio</Button>
          </Link>
          <Link to="/reservas" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              Reservar turno
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
