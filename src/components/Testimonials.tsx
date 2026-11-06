import { useState } from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Quote } from 'lucide-react'
import { resume } from '../data/resume'
import { RevealHeading } from './cinematic'

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm select-none"
      style={{
        background: `${color}20`,
        border: `2px solid ${color}40`,
        color,
      }}
    >
      {initials}
    </div>
  )
}

function TestimonialCard({
  t,
  index,
}: {
  t: (typeof resume.testimonials)[number]
  index: number
}) {
  const [expanded, setExpanded] = useState(false)
  const LIMIT = 220
  const isLong = t.quote.length > LIMIT
  const display = isLong && !expanded ? t.quote.slice(0, LIMIT).trimEnd() + '…' : t.quote

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="glass-card p-6 h-full flex flex-col gap-4">
        {/* Quote icon */}
        <Quote size={18} className="flex-shrink-0" style={{ color: t.color, opacity: 0.6 }} />

        {/* Quote text */}
        <p className="text-fg-muted text-sm leading-relaxed flex-1">
          {display}
          {isLong && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="ml-1 font-medium transition-colors"
              style={{ color: t.color }}
            >
              {expanded ? 'less' : 'more'}
            </button>
          )}
        </p>

        {/* Person */}
        <div className="flex items-center gap-3 pt-3 border-t border-border">
          <Avatar initials={t.initials} color={t.color} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-fg font-semibold text-sm truncate">{t.name}</span>
              <a
                href={t.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-fg-muted hover:text-fg transition-colors"
                aria-label={`${t.name} on LinkedIn`}
              >
                <Linkedin size={13} />
              </a>
            </div>
            <div className="text-xs text-fg-muted truncate">{t.title}</div>
            <div
              className="text-xs font-medium mt-0.5"
              style={{ color: t.color, opacity: 0.85 }}
            >
              {t.relationship} · {t.date}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <span className="text-violet text-[13px] font-bold mb-3 block tracking-wide uppercase">
            Recommendations
          </span>
          <RevealHeading weight={700} className="text-4xl font-bold text-fg leading-tight">
            What colleagues say.
          </RevealHeading>
          <p className="text-fg-muted text-sm mt-3 max-w-md">
            6 recommendations on LinkedIn — from managers, tech leads, and teammates.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resume.testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
