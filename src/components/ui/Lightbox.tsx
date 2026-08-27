import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface LightboxProps {
  open: boolean
  src: string
  alt: string
  type?: 'image' | 'video'
  onClose: () => void
}

export function Lightbox({ open, src, alt, type = 'image', onClose }: LightboxProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src, open])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white focus-ring"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {failed ? (
              <p className="bg-ink p-8 text-center text-white">
                No se pudo cargar este archivo.
              </p>
            ) : type === 'video' ? (
              <video
                src={src}
                title={alt}
                className="max-h-[85vh] w-full bg-ink"
                controls
                playsInline
                preload="metadata"
                onError={() => setFailed(true)}
              />
            ) : (
              <img
                src={src}
                alt={alt}
                className="max-h-[85vh] w-full object-contain"
                onError={() => setFailed(true)}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
