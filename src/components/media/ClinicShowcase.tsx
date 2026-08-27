import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { CLINIC_PHOTOS } from '@/data/media'
import { cn } from '@/lib/utils'

const layout = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1 sm:col-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
]

/** Composición visual de instalaciones: recepción, entrada y espacios clínicos. */
export function ClinicShowcase() {
  const ordered = [
    CLINIC_PHOTOS[7],
    CLINIC_PHOTOS[1],
    CLINIC_PHOTOS[0],
    CLINIC_PHOTOS[4],
    CLINIC_PHOTOS[2],
    CLINIC_PHOTOS[3],
    CLINIC_PHOTOS[5],
    CLINIC_PHOTOS[6],
  ]

  return (
    <div className="grid auto-rows-[140px] grid-cols-2 gap-2.5 sm:auto-rows-[180px] sm:gap-3 md:auto-rows-[160px] md:grid-cols-4 lg:auto-rows-[170px]">
      {ordered.map((photo, i) => (
        <AnimatedSection
          key={photo.src}
          delay={i * 0.04}
          className={cn(
            'h-full min-h-0 overflow-hidden rounded-2xl sm:rounded-3xl',
            layout[i],
          )}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
            loading={i < 2 ? 'eager' : 'lazy'}
          />
        </AnimatedSection>
      ))}
    </div>
  )
}
