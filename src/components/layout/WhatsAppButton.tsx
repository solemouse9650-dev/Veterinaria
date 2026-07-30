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
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/35 focus-ring md:bottom-8 md:right-8"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 220 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="h-7 w-7" />
    </motion.a>
  )
}
