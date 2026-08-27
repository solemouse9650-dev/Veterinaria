import { Link, useParams } from 'react-router-dom'
import { SEO } from '@/components/seo/SEO'
import { Button } from '@/components/ui/Button'
import { useSite } from '@/contexts/SiteContext'
import { formatDate } from '@/lib/utils'
import { sanitizeHtml } from '@/lib/sanitize'

export function BlogPost() {
  const { slug } = useParams()
  const { blog } = useSite()
  const post = blog.find((p) => p.slug === slug)

  if (!post) {
    return (
      <section className="container-page section-pad page-top text-center">
        <h1 className="font-display text-3xl font-semibold">Artículo no encontrado</h1>
        <Link to="/blog" className="mt-6 inline-block">
          <Button>Volver al blog</Button>
        </Link>
      </section>
    )
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.image}
        type="article"
      />
      <article className="section-pad page-top">
        <div className="container-page max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            {post.category} · {formatDate(post.publishedAt)}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-3 text-muted">Por {post.author}</p>
          <img
            src={post.image}
            alt={post.title}
            className="mt-8 aspect-[16/9] w-full rounded-[2rem] object-cover"
          />
          <div
            className="prose-blog mt-8"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />
          <Link to="/blog" className="mt-10 inline-block">
            <Button variant="outline">Volver al blog</Button>
          </Link>
        </div>
      </article>
    </>
  )
}
