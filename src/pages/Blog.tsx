import { Link } from 'react-router-dom'
import { SEO } from '@/components/seo/SEO'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useSite } from '@/contexts/SiteContext'
import { formatDate } from '@/lib/utils'

export function Blog() {
  const { blog } = useSite()

  return (
    <>
      <SEO
        title="Blog"
        description="Consejos veterinarios, prevención, nutrición y urgencias para tutores responsables."
        path="/blog"
      />
      <section className="section-pad pt-32">
        <div className="container-page">
          <SectionHeading
            eyebrow="Blog"
            title="Educación veterinaria clara y práctica"
            description="Artículos pensados para ayudarte a cuidar mejor a tu mascota todos los días."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blog.map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 0.05}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block overflow-hidden rounded-[2rem] border border-line bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="aspect-[16/11] w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                      {post.category} · {formatDate(post.publishedAt)}
                    </p>
                    <h2 className="mt-2 font-display text-xl font-semibold group-hover:text-brand-700">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
