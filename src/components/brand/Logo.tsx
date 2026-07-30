import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  imgClassName?: string
  showWordmark?: boolean
}

export function Logo({ className, imgClassName, showWordmark = false }: LogoProps) {
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-2 sm:gap-2.5', className)}>
      <img
        src="/logo.png"
        alt="EcoVet Clínica Veterinaria"
        className={cn(
          'h-10 w-10 shrink-0 rounded-full object-cover shadow-sm ring-1 ring-brand-200/60 sm:h-12 sm:w-12',
          imgClassName,
        )}
      />
      {showWordmark && (
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-display text-lg font-bold tracking-tight text-brand-700 sm:text-xl">
            EcoVet
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-brand-500 sm:block">
            Clínica Veterinaria
          </span>
        </span>
      )}
    </span>
  )
}
