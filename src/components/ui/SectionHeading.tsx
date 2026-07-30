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
        'mb-8 max-w-3xl sm:mb-10',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'mb-2 text-xs font-semibold uppercase tracking-[0.16em] sm:mb-3 sm:text-sm sm:tracking-[0.18em]',
            light ? 'text-brand-200' : 'text-brand-600',
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'font-display text-[1.75rem] font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-[2.75rem]',
          light ? 'text-white' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-3 text-sm leading-relaxed sm:mt-4 sm:text-base md:text-lg',
            light ? 'text-white/75' : 'text-muted',
          )}
        >
          {description}
        </p>
      )}
    </AnimatedSection>
  )
}
