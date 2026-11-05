import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, GitPullRequest } from 'lucide-react'
import { resume } from '../data/resume'

// Fixed colors per type so the same tag is always the same color
const typeColors: Record<string, string> = {
  'AI': '#6E55FF',
  'Marketplace': '#42F5C8',
  'Open Source': '#FBBF24',
  'Mobile': '#F472B6',
}

function use3DTilt() {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(700px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateZ(4px)`
    el.style.transition = 'transform 0.1s ease'
  }
  const onLeave = () => {
    if (ref.current) {
      ref.current.style.transform = ''
      ref.current.style.transition = 'transform 0.4s ease'
    }
  }

  return { ref, onMove, onLeave }
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof resume.projects)[number]
  index: number
}) {
  const { ref, onMove, onLeave } = use3DTilt()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="glass-card p-6 flex flex-col gap-4 h-full cursor-default select-none"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {/* Top */}
        <div className="flex items-start justify-between gap-2">
          {(() => {
            const tagColor = typeColors[project.type] ?? '#6E55FF'
            return (
              <div
                className="text-xs font-semibold px-2 py-1 rounded-full"
                style={{ background: `${tagColor}18`, color: tagColor }}
              >
                {project.type}
              </div>
            )
          })()}
          <div className="flex gap-1 items-center">
            {project.prs !== null && (
              <span className="flex items-center gap-1 text-xs text-fg-muted mr-1">
                <GitPullRequest size={11} style={{ color: project.color }} />
                {project.prs}
              </span>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-muted hover:text-fg transition-colors p-1.5 -m-1.5"
                aria-label={`View ${project.title}`}
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <div
            className="w-8 h-0.5 rounded-full mb-3 transition-all duration-300"
            style={{ background: project.color }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.width = '48px' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.width = '32px' }}
          />
          <h3 className="font-bold text-fg text-lg leading-tight">{project.title}</h3>
          <p className="text-fg-muted text-sm mt-0.5">{project.subtitle}</p>
        </div>

        {/* Body */}
        <p className="text-fg-muted text-sm leading-relaxed flex-1">{project.description}</p>

        {/* Contribution */}
        <p className="text-xs text-fg-subtle leading-relaxed italic border-t border-border pt-3">
          {project.contribution}
        </p>

        {/* Stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map(s => (
            <span
              key={s}
              className="text-xs px-2 py-0.5 rounded-md border border-border text-fg-muted"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function Projects() {
  return (
    <section id="projects" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <span className="text-violet text-sm font-semibold mb-3 block">Projects</span>
          <h2 className="text-4xl font-bold text-fg leading-tight">Things I've built.</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resume.projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
