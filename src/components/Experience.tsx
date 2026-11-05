import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { resume } from '../data/resume'

export function Experience() {
  // Expand first two entries (Recco + Better Software) by default
  const [openSet, setOpenSet] = useState<Set<number>>(new Set([0, 1]))

  const toggle = (i: number) => {
    setOpenSet(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <section id="experience" className="section bg-bg-2/30">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-violet text-sm font-semibold mb-3 block">Experience</span>
          <h2 className="text-4xl font-bold text-fg mb-12 leading-tight">
            Where I've shipped.
          </h2>
        </motion.div>

        <div className="flex flex-col gap-3">
          {resume.experience.map((exp, i) => {
            const isOpen = openSet.has(i)
            return (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card overflow-hidden transition-colors duration-200"
                style={{ borderColor: isOpen ? `${exp.color}30` : undefined }}
              >
                {/* Header row */}
                <button
                  className="w-full flex items-start justify-between gap-4 p-5 md:p-6 text-left min-h-[64px]"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    {/* Color dot */}
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5"
                      style={{ background: exp.color }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-bold text-fg text-base">{exp.company}</span>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ background: `${exp.color}18`, color: exp.color }}
                        >
                          {exp.type}
                        </span>
                      </div>
                      <div className="text-sm text-fg-muted mt-0.5">{exp.role}</div>
                      {/* Period — always visible including mobile */}
                      <div className="text-xs text-fg-subtle mt-0.5">{exp.period}</div>
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className="text-fg-muted transition-transform duration-300 flex-shrink-0 mt-1"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>

                {/* Expandable body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-5 md:px-6 pb-6 border-t border-border pt-4">
                        <p className="text-fg-muted text-sm leading-relaxed mb-4">
                          {exp.summary}
                        </p>
                        <ul className="space-y-2 mb-4">
                          {exp.bullets.map((b, bi) => (
                            <li key={bi} className="flex gap-3 text-sm text-fg-muted">
                              <span style={{ color: exp.color }} className="mt-1 flex-shrink-0 text-xs">▸</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {exp.stack.map(s => (
                            <span
                              key={s}
                              className="text-xs font-medium px-2 py-0.5 rounded-md border border-border text-fg-muted"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Education row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 glass-card p-6"
        >
          <span className="text-xs font-semibold text-fg-muted mb-1 block">Education</span>
          <div className="font-bold text-fg">{resume.education.institution}</div>
          <div className="text-sm text-fg-muted mt-0.5">{resume.education.degree}</div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-fg-subtle">{resume.education.period}</span>
            <span className="text-xs font-semibold text-mint">CGPA {resume.education.cgpa}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
