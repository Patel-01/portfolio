import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, GitPullRequest } from 'lucide-react'
import { resume } from '../data/resume'
import { RevealHeading, ScrambleText } from './cinematic'

function ProjectLogoTile({ src, name, color }: { src: string | null; name: string; color: string }) {
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

const typeColors: Record<string, string> = {
  'AI': '#6E55FF',
  'AI Platform': '#6E55FF',
  'AI + Mobile': '#42F5C8',
  'Marketplace': '#42F5C8',
  'Open Source': '#FBBF24',
  'Mobile': '#F472B6',
  'Consumer': '#F97316',
  'HealthTech': '#38BDF8',
  'Contract': '#FBBF24',
}

function use3DTilt() {
  const ref = useRef<HTMLElement>(null)

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
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
  total,
}: {
  project: (typeof resume.projects)[number]
  index: number
  total: number
}) {
  const { ref, onMove, onLeave } = use3DTilt()
  const isLinked = !!project.link
  const isOrphan = total % 3 === 1 && index === total - 1

  const cardClassName = `glass-card p-6 flex flex-col h-full select-none transition-all duration-150
    hover:border-violet/40 hover:-translate-y-0.5 hover:bg-white/[0.02]
    focus-visible:border-violet/40 focus-visible:bg-white/[0.02] focus-visible:outline-none focus-visible:-translate-y-0.5
    ${isLinked ? 'cursor-pointer' : 'cursor-default'}`
  const cardStyle: React.CSSProperties = { transformStyle: 'preserve-3d', willChange: 'transform' }

  const tagColor = typeColors[project.type] ?? '#6E55FF'

  const inner = (
    <>
      {/* Top row: type tag + link icon */}
      <div className="flex items-start justify-between gap-2">
        <div
          className="text-xs font-semibold px-2 py-1 rounded-full"
          style={{ background: `${tagColor}18`, color: tagColor }}
        >
          {project.type}
        </div>
        {project.link && (
          <span className="text-fg-muted p-1.5 -m-1.5" aria-hidden="true">
            <ExternalLink size={14} />
          </span>
        )}
      </div>

      {/* Title row: logo + title + subtitle */}
      <div className="flex items-start gap-3 mt-2">
        <ProjectLogoTile
          src={project.logo ? `${import.meta.env.BASE_URL}${project.logo}` : null}
          name={project.title}
          color={project.color}
        />
        <div className="min-w-0">
          <h3 className="font-bold text-fg text-lg leading-tight">
            <ScrambleText text={project.title} trigger="hover" />
          </h3>
          <p className="text-fg-muted text-sm mt-0.5">{project.subtitle}</p>
        </div>
      </div>

      {/* Body */}
      <p className="text-fg-muted text-sm leading-relaxed flex-1 mt-1">{project.description}</p>

      {/* Footer: pinned to bottom */}
      <div className="mt-auto pt-3 border-t border-border flex flex-col gap-3">
        <p className="text-xs text-fg-muted leading-relaxed italic">
          {project.contribution}
        </p>
        {project.prs !== null && (
          <span className="flex items-center gap-1 text-xs text-fg-muted">
            <GitPullRequest size={11} style={{ color: project.color }} />
            {project.prs} PRs
          </span>
        )}
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
    </>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={isOrphan ? 'sm:col-span-2 lg:col-span-3' : ''}
    >
      {isLinked ? (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={project.link!}
          target="_blank"
          rel="noopener noreferrer"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className={cardClassName}
          style={cardStyle}
          aria-label={`View ${project.title}`}
        >
          {inner}
        </a>
      ) : (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className={cardClassName}
          style={cardStyle}
        >
          {inner}
        </div>
      )}
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
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <span className="text-violet text-[13px] font-bold mb-3 block tracking-wide uppercase">Projects</span>
          <RevealHeading weight={700} className="text-4xl font-bold text-fg leading-tight">
            Things I've built.
          </RevealHeading>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resume.projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} total={resume.projects.length} />
          ))}
        </div>
      </div>
    </section>
  )
}
