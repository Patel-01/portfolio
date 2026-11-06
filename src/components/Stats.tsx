import { motion } from 'framer-motion'
import { resume } from '../data/resume'
import { RollingNumber } from './cinematic'

function StatItem({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-5xl font-black tracking-tight leading-none">
        <RollingNumber value={value} suffix={suffix} />
      </span>
      <span className="text-[13px] text-fg-muted font-semibold">{label}</span>
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
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-10 md:justify-items-center"
        >
          {resume.stats.map(s => (
            <StatItem key={s.label} value={s.value} label={s.label} suffix={s.suffix} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
