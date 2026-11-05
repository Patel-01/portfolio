import { motion } from 'framer-motion'
import { resume } from '../data/resume'

const categoryColors: Record<string, string> = {
  'Frontend': '#6E55FF',
  'Backend': '#42F5C8',
  'Data': '#FBBF24',
  'AI / LLMs': '#A78BFA',
  'DevOps': '#34D399',
  'Payments': '#F472B6',
  'Testing': '#60A5FA',
}

export function Skills() {
  const categories = Object.entries(resume.skills)

  return (
    <section id="skills" className="section bg-bg-2/30">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <span className="text-violet text-sm font-semibold mb-3 block">Skills</span>
          <h2 className="text-4xl font-bold text-fg leading-tight">
            The stack.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {categories.map(([category, skills], i) => {
            const color = categoryColors[category] ?? '#6E55FF'
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: color }}
                  />
                  <span className="font-semibold text-sm text-fg">{category}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(skills as readonly string[]).map(skill => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg border border-border text-fg-muted
                        hover:text-fg hover:border-opacity-50 transition-colors cursor-default"
                      style={{
                        // subtle hover tint via inline style
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget
                        el.style.borderColor = `${color}40`
                        el.style.background = `${color}10`
                        el.style.color = color
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget
                        el.style.borderColor = ''
                        el.style.background = ''
                        el.style.color = ''
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 glass-card p-5"
        >
          <span className="font-semibold text-sm text-fg mb-4 block">Certifications & Badges</span>
          <div className="flex flex-wrap gap-2">
            {resume.certifications.map(cert => (
              <span
                key={cert}
                className="text-xs font-medium px-3 py-1 rounded-full border border-mint/25 bg-mint/8 text-mint"
              >
                {cert}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
