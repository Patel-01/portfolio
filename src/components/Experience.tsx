import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { resume } from '../data/resume'
import { RevealHeading } from './cinematic'

function LogoTile({ src, name, color }: { src: string | null; name: string; color: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div
      className="w-7 h-7 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden border border-border"
      style={{ background: `${color}18` }}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={`${name} logo`}
          className="w-5 h-5 object-contain"
          onError={() => setFailed(true)}
          loading="lazy"
          width={20}
          height={20}
        />
      ) : (
        <span className="text-xs font-bold leading-none select-none" style={{ color }}>{name[0]}</span>
      )}
    </div>
  )
}

export function Experience() {
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
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-violet text-[13px] font-bold mb-3 block tracking-wide uppercase">Experience</span>
          <RevealHeading weight={700} className="text-4xl font-bold text-fg mb-12 leading-tight">
            Where I've shipped.
          </RevealHeading>
        </motion.div>

        <div className="flex flex-col gap-3">
          {resume.experience.map((exp, i) => {
            const isOpen = openSet.has(i)
            const bodyId = `exp-body-${i}`
            return (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={{ duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card overflow-hidden transition-colors duration-200"
                style={{ borderColor: isOpen ? `${exp.color}30` : undefined }}
              >
                {/* Header row */}
                <button
                  className="w-full flex items-start justify-between gap-4 p-5 md:p-6 text-left min-h-[64px]"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={bodyId}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <LogoTile
                      src={exp.logo ? `${import.meta.env.BASE_URL}${exp.logo}` : null}
                      name={exp.company}
                      color={exp.color}
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
                      <div className="text-xs text-fg-muted mt-0.5">{exp.period}</div>
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-fg-muted flex-shrink-0 mt-1 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                {/* CSS grid height animation — no instant jump */}
                <div
                  id={bodyId}
                  role="region"
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 200ms ease',
                  }}
                >
                  <div className="overflow-hidden">
                    <div
                      className="px-5 md:px-6 pb-6 border-t border-border pt-4"
                      style={{
                        opacity: isOpen ? 1 : 0,
                        transition: 'opacity 200ms ease',
                      }}
                    >
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
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 glass-card p-6"
        >
          <span className="text-xs font-semibold text-fg-muted mb-1 block">Education</span>
          <div className="font-bold text-fg">{resume.education.institution}</div>
          <div className="text-sm text-fg-muted mt-0.5">{resume.education.degree}</div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-fg-muted">{resume.education.period}</span>
            <span className="text-xs font-semibold text-mint">CGPA {resume.education.cgpa}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
