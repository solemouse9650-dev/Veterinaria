import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { cn } from '@/lib/utils'
import type { TeamMember } from '@/types'

const photoPosition: Record<string, string> = {
  'team-1': 'object-[center_18%]',
  'team-2': 'object-center',
  'team-3': 'object-[center_22%]',
}

interface TeamMemberCardProps {
  member: TeamMember
  delay?: number
  variant?: 'light' | 'dark'
  compact?: boolean
}

export function TeamMemberCard({
  member,
  delay = 0,
  variant = 'light',
  compact = false,
}: TeamMemberCardProps) {
  const dark = variant === 'dark'
  const areas = member.areas?.filter(Boolean) ?? []

  return (
    <AnimatedSection delay={delay}>
      <article
        className={cn(
          'h-full overflow-hidden rounded-[1.5rem] border sm:rounded-[2rem]',
          dark
            ? 'border-white/10 bg-white/5'
            : 'border-line bg-white shadow-sm shadow-brand-900/5',
        )}
      >
        <div className={cn('overflow-hidden', compact ? 'aspect-[4/5]' : 'aspect-[3/4]')}>
          <img
            src={member.image}
            alt={`${member.name} - profesional de EcoVet Clínica Veterinaria`}
            className={cn(
              'h-full w-full object-cover transition duration-500 hover:scale-[1.03]',
              photoPosition[member.id] || 'object-top',
            )}
            loading="lazy"
          />
        </div>
        <div className={cn('p-4 sm:p-5', compact && 'p-3 sm:p-4')}>
          <h3
            className={cn(
              'font-display font-semibold leading-snug',
              compact ? 'text-sm sm:text-lg' : 'text-lg sm:text-xl',
              dark ? 'text-white' : 'text-ink',
            )}
          >
            {member.name}
          </h3>
          {member.specialty && (
            <p
              className={cn(
                'mt-1 text-sm font-medium',
                dark ? 'text-brand-200' : 'text-brand-700',
              )}
            >
              {member.specialty}
            </p>
          )}
          {member.description &&
            member.description !== member.specialty && (
              <p
                className={cn(
                  'mt-2 text-sm leading-relaxed',
                  dark ? 'text-white/70' : 'text-muted',
                )}
              >
                {member.description}
              </p>
            )}
          {areas.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {areas.map((area) => (
                <li
                  key={area}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[11px] font-medium sm:text-xs',
                    dark
                      ? 'bg-white/10 text-white/90'
                      : 'bg-brand-50 text-brand-800',
                  )}
                >
                  {area}
                </li>
              ))}
            </ul>
          )}
          {member.experience && (
            <p
              className={cn(
                'mt-3 text-sm',
                dark ? 'text-white/70' : 'text-muted',
              )}
            >
              <span className={dark ? 'text-white' : 'font-semibold text-ink'}>
                Experiencia:
              </span>{' '}
              {member.experience}
            </p>
          )}
          {member.schedule && (
            <p
              className={cn(
                'mt-1 text-sm',
                dark ? 'text-white/70' : 'text-muted',
              )}
            >
              <span className={dark ? 'text-white' : 'font-semibold text-ink'}>
                Horarios:
              </span>{' '}
              {member.schedule}
            </p>
          )}
        </div>
      </article>
    </AnimatedSection>
  )
}
