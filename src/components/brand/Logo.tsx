import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  imgClassName?: string
  showWordmark?: boolean
}

export function Logo({ className, imgClassName, showWordmark = false }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <img
        src="/logo.png"
        alt="EcoVet Clínica Veterinaria"
        className={cn(
          'h-12 w-12 rounded-full object-cover shadow-sm ring-1 ring-brand-200/60',
          imgClassName,
        )}
      />
      {showWordmark && (
        <span className="leading-tight">
          <span className="block font-display text-xl font-bold tracking-tight text-brand-700">
            EcoVet
          </span>
          <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-brand-500">
            Clínica Veterinaria
          </span>
        </span>
      )}
    </span>
  )
}
