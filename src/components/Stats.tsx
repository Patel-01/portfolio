import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { resume } from '../data/resume'

function useCounter(target: number, duration = 1600) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const ran = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !ran.current) {
          ran.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            setCount(Math.round((1 - Math.pow(1 - p, 3)) * target))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, duration])

  return { count, ref }
}

function StatItem({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  const { count, ref } = useCounter(value)

  return (
    <div ref={ref} className="flex flex-col items-center md:items-start gap-1">
      <span
        className="text-5xl font-black tracking-tight grad-text"
        aria-label={`${value}${suffix}`}
      >
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className="text-sm text-fg-muted font-medium">{label}</span>
    </div>
  )
}

export function Stats() {
  return (
    <section id="stats" className="border-y border-border bg-bg-2/50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-10"
        >
          {resume.stats.map(s => (
            <StatItem key={s.label} value={s.value} label={s.label} suffix={s.suffix} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
