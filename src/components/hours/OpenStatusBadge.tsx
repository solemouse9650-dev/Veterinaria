import { useEffect, useState } from 'react'
import { getClinicOpenStatus } from '@/lib/hours'
import { cn } from '@/lib/utils'
import type { HoursConfig } from '@/types'

interface OpenStatusBadgeProps {
  hours: HoursConfig
  variant?: 'light' | 'dark'
  className?: string
}

export function OpenStatusBadge({
  hours,
  variant = 'light',
  className,
}: OpenStatusBadgeProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const status = getClinicOpenStatus(hours, now)
  const dark = variant === 'dark'

  return (
    <div
      className={cn(
        'inline-flex max-w-full flex-col items-start gap-1 rounded-2xl px-3 py-2',
        dark ? 'bg-white/10 text-white' : 'bg-brand-50 text-ink',
        className,
      )}
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-2 text-sm font-semibold">
        <span
          className={cn(
            'h-2.5 w-2.5 shrink-0 rounded-full',
            status.open ? 'bg-emerald-400' : 'bg-red-500',
          )}
          aria-hidden
        />
        {status.label}
      </span>
      {status.note ? (
        <span
          className={cn(
            'text-xs font-medium',
            dark ? 'text-white/75' : 'text-muted',
          )}
        >
          {status.note}
        </span>
      ) : null}
    </div>
  )
}
