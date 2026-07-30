import { cn } from '@/lib/utils'

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-10 w-10 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600',
        className,
      )}
      role="status"
      aria-label="Cargando"
    />
  )
}
