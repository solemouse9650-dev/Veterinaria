import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSite } from '@/contexts/SiteContext'
import { whatsappUrl } from '@/lib/utils'

export function WhatsAppButton() {
  const { site } = useSite()

  return (
    <motion.a
      href={whatsappUrl(
        site.whatsapp,
        'Hola EcoVet, quiero consultar por un turno para mi mascota.',
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-[calc(1rem+env(safe-area-inset-right,0px))] z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/35 focus-ring sm:h-14 sm:w-14 md:bottom-[calc(2rem+env(safe-area-inset-bottom,0px))] md:right-[calc(2rem+env(safe-area-inset-right,0px))]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 220 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
    </motion.a>
  )
}
