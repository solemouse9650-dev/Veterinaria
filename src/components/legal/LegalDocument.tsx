import { Link } from 'react-router-dom'
import { SEO } from '@/components/seo/SEO'
import { Button } from '@/components/ui/Button'

export interface LegalSection {
  id: string
  title: string
  paragraphs: string[]
}

interface LegalDocumentProps {
  title: string
  description: string
  path: string
  updated: string
  intro: string
  sections: LegalSection[]
}

export function LegalDocument({
  title,
  description,
  path,
  updated,
  intro,
  sections,
}: LegalDocumentProps) {
  return (
    <>
      <SEO title={title} description={description} path={path} />
      <section className="section-pad page-top">
        <div className="container-page grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
              Información legal
            </p>
            <nav className="mt-4 space-y-2 text-sm" aria-label="Índice legal">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-lg px-2 py-1.5 text-muted hover:bg-brand-50 hover:text-ink"
                >
                  {section.title}
                </a>
              ))}
            </nav>
            <Link to="/" className="mt-6 inline-block">
              <Button variant="outline" size="sm">
                Volver al sitio
              </Button>
            </Link>
          </aside>

          <article className="max-w-3xl">
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-muted">Última actualización: {updated}</p>
            <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">
              {intro}
            </p>
            <p className="mt-3 rounded-2xl border border-line bg-brand-50 px-4 py-3 text-sm text-brand-900">
              Este texto es información general adaptada al funcionamiento del sitio.
              Debe ser revisado por un profesional jurídico antes de considerarse un
              documento definitivo.
            </p>

            <div className="mt-10 space-y-10">
              {sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="font-display text-xl font-semibold sm:text-2xl">
                    {index + 1}. {section.title}
                  </h2>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted sm:text-base">
                    {section.paragraphs.map((paragraph, i) => (
                      <p key={`${section.id}-${i}`}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
