import { motion } from 'framer-motion'
import { Clock3, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Service } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface ServiceCardProps {
  service: Service
  index?: number
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-3xl border border-line bg-white shadow-sm shadow-brand-900/5"
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.style.visibility = 'hidden'
          }}
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-800 backdrop-blur">
          {service.category}
        </span>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink sm:text-xl">
            {service.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {service.shortDescription}
          </p>
        </div>
        {(service.price > 0 || service.duration > 0) && (
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            {service.price > 0 && (
              <span className="font-semibold text-brand-700">
                desde {formatPrice(service.price)}
              </span>
            )}
            {service.duration > 0 && (
              <span className="inline-flex items-center gap-1 text-muted">
                <Clock3 className="h-4 w-4" />
                {service.duration >= 60 && service.duration % 60 === 0
                  ? `${service.duration / 60} h`
                  : `${service.duration} min`}
              </span>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 gap-2 xs:grid-cols-2">
          <Link to={`/servicios/${service.slug}`}>
            <Button variant="outline" className="w-full" size="sm">
              Ver detalle
            </Button>
          </Link>
          {service.category !== 'Próximamente' ? (
            <Link to={`/reservas?servicio=${service.slug}`}>
              <Button className="w-full" size="sm">
                <CalendarDays className="h-4 w-4" />
                Reservar
              </Button>
            </Link>
          ) : (
            <Button className="w-full" size="sm" disabled>
              Próximamente
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  )
}
