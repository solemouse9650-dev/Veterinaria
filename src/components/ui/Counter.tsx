import { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface CounterProps {
  value: string
  label: string
}

function parseTarget(value: string) {
  const num = Number(value.replace(/[^\d]/g, ''))
  return Number.isFinite(num) ? num : 0
}

export function Counter({ value, label }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const target = parseTarget(value)
  const suffix = value.replace(/[\d.,\s]/g, '')
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (target === 0) {
      setCount(0)
      return
    }
    let frame = 0
    const total = 40
    const id = window.setInterval(() => {
      frame += 1
      setCount(Math.round((target * frame) / total))
      if (frame >= total) window.clearInterval(id)
    }, 28)
    return () => window.clearInterval(id)
  }, [inView, target])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-md sm:rounded-2xl sm:px-5 sm:py-6"
    >
      <p className="font-display text-xl font-semibold text-white sm:text-3xl md:text-4xl">
        {target > 0 ? `${count}${suffix}` : value}
      </p>
      <p className="mt-1 text-[11px] leading-snug text-white/75 sm:mt-2 sm:text-sm">
        {label}
      </p>
    </motion.div>
  )
}
