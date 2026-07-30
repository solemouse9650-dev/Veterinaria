import { AnimatedSection } from './AnimatedSection'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
  light?: boolean
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  light = false,
}: SectionHeadingProps) {
  return (
    <AnimatedSection
      className={cn(
        'mb-10 max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'mb-3 text-sm font-semibold uppercase tracking-[0.18em]',
            light ? 'text-brand-200' : 'text-brand-600',
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'font-display text-3xl font-semibold tracking-tight md:text-4xl lg:text-[2.75rem]',
          light ? 'text-white' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-base leading-relaxed md:text-lg',
            light ? 'text-white/75' : 'text-muted',
          )}
        >
          {description}
        </p>
      )}
    </AnimatedSection>
  )
}
