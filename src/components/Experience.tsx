import { Fragment, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { resume } from '../data/resume'
import { RevealHeading, ScrambleText } from './cinematic'
import { BRAND_GRADIENT, VAR_FONT, srOnly } from './cinematic/utils'

type Exp = (typeof resume.experience)[number]

const SPINE_GRADIENT = 'linear-gradient(to bottom, rgb(110,85,255), rgb(66,245,200))'
const EASE = [0.22, 1, 0.36, 1] as const

// ─── Date reel ────────────────────────────────────────────────────────────────

function DigitSpin({ digit, delay }: { digit: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reel = Array.from({ length: 20 }, (_, i) => i % 10)
  return (
    <span
      ref={ref}
      style={{ display: 'inline-block', overflow: 'hidden', height: '1em', verticalAlign: 'top', fontVariantNumeric: 'tabular-nums' }}
    >
      <motion.span
        style={{ display: 'flex', flexDirection: 'column' }}
        initial={{ y: 0 }}
        animate={inView ? { y: `${-(10 + digit)}em` } : {}}
        transition={{ duration: 0.7, delay, ease: EASE }}
      >
        {reel.map((d, i) => (
          <span key={i} style={{ display: 'block', height: '1em', lineHeight: 1 }}>{d}</span>
        ))}
      </motion.span>
    </span>
  )
}

function DateReel({ value, reduce, className }: { value: string; reduce: boolean; className?: string }) {
  if (reduce) return <span className={className}>{value}</span>
  const chars = value.split('')
  let di = 0
  const totalDigits = chars.filter(c => /\d/.test(c)).length
  return (
    <span className={className}>
      <span style={srOnly}>{value}</span>
      <span aria-hidden>
        {chars.map((c, i) => {
          if (/\d/.test(c)) {
            const idx = di++
            return <DigitSpin key={i} digit={parseInt(c)} delay={idx * (0.5 / Math.max(totalDigits, 1))} />
          }
          return <span key={i}>{c}</span>
        })}
      </span>
    </span>
  )
}

// ─── Highlight marker ─────────────────────────────────────────────────────────

function HighlightMark({ text, reduce }: { text: string; reduce: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' })
  return (
    <motion.span
      ref={ref}
      animate={{ backgroundSize: inView || reduce ? '100% 0.09em' : '0% 0.09em' }}
      transition={{ duration: 0.9, ease: EASE }}
      style={{
        backgroundImage: BRAND_GRADIENT,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 100%',
        backgroundSize: '0% 0.09em',
      }}
    >
      {text}
    </motion.span>
  )
}

function BulletLine({ text, highlight, reduce }: { text: string; highlight: string | null | undefined; reduce: boolean }) {
  if (!highlight) return <>{text}</>
  const idx = text.indexOf(highlight)
  if (idx < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <HighlightMark text={highlight} reduce={reduce} />
      {text.slice(idx + highlight.length)}
    </>
  )
}

// ─── Company name with scroll-linked weight ───────────────────────────────────

function CompanyName({ name, reduce }: { name: string; reduce: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: ['start 0.85', 'start 0.45'],
  })
  const fontVariationSettings = useTransform(scrollYProgress, v => `'wght' ${Math.round(200 + v * 600)}`)
  const words = name.split(' ')
  return (
    <span ref={ref} className="font-bold text-fg text-base">
      <motion.span
        style={{
          fontFamily: VAR_FONT,
          fontVariationSettings: reduce ? "'wght' 700" : fontVariationSettings,
        }}
      >
        {words.map((word, i) => (
          <Fragment key={i}>
            <span style={{ whiteSpace: 'nowrap' }}>{word}</span>
            {i < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </motion.span>
    </span>
  )
}

// ─── Logo tile ────────────────────────────────────────────────────────────────

function LogoTile({ src, name, color }: { src: string | null; name: string; color: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div
      className="w-7 h-7 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden border border-border"
      style={{ background: `${color}18` }}
    >
      {src && !failed ? (
        <img src={src} alt="" width={20} height={20} className="w-5 h-5 object-contain"
          onError={() => setFailed(true)} loading="lazy" />
      ) : (
        <span className="text-xs font-bold leading-none select-none" style={{ color }}>{name[0]}</span>
      )}
    </div>
  )
}

// ─── Role item ────────────────────────────────────────────────────────────────

interface RoleItemProps {
  exp: Exp
  index: number
  n: number
  spineProgress: MotionValue<number>
  isOpen: boolean
  onToggle: () => void
  reduce: boolean
}

function RoleItem({ exp, index, n, spineProgress, isOpen, onToggle, reduce }: RoleItemProps) {
  const bodyId = `exp-body-${index}`
  const headerId = `exp-header-${index}`

  // Dot fills when spine progress passes this role's threshold
  const threshold = (index + 0.5) / n
  const [isFilled, setIsFilled] = useState(() => reduce || spineProgress.get() >= threshold)
  useEffect(() => {
    if (reduce) { setIsFilled(true); return }
    return spineProgress.on('change', v => setIsFilled(v >= threshold))
  }, [spineProgress, threshold, reduce])

  // Pulse on the dot while this role's header is in the viewport center band
  const headerRef = useRef<HTMLButtonElement>(null)
  const [isCurrent, setIsCurrent] = useState(false)
  useEffect(() => {
    if (reduce) return
    const el = headerRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setIsCurrent(e.isIntersecting), {
      rootMargin: '-38% 0px -38% 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])

  // Apply highlight to only the first bullet that contains the phrase
  let highlightedOnce = false
  const getHighlight = (bullet: string) => {
    if (highlightedOnce || !exp.highlight) return null
    if (!bullet.includes(exp.highlight)) return null
    highlightedOnce = true
    return exp.highlight
  }

  const panelContent = (
    <div className="px-5 md:px-6 pb-6 border-t border-border pt-4">
      <p className="text-fg-muted text-sm leading-relaxed mb-4">{exp.summary}</p>
      <ul className="space-y-2 mb-4">
        {exp.bullets.map((b, bi) => (
          <li key={bi} className="flex gap-3 text-sm text-fg-muted">
            <span style={{ color: exp.color }} className="mt-1 flex-shrink-0 text-xs">▸</span>
            <span>
              <BulletLine text={b} highlight={getHighlight(b)} reduce={reduce} />
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5 mt-4">
        {exp.stack.map(s => (
          <span key={s} className="text-xs font-medium px-2 py-0.5 rounded-md border border-border text-fg-muted">{s}</span>
        ))}
      </div>
    </div>
  )

  return (
    <li style={{ position: 'relative', marginBottom: 12 }}>
      {/* Timeline dot ─── aria-hidden, decorative */}
      <div
        aria-hidden
        style={{ position: 'absolute', left: -35, top: 20, width: 8, height: 8, zIndex: 1 }}
      >
        {/* Dim ring */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(232,231,255,.22)' }} />
        {/* Gradient fill */}
        <motion.div
          animate={{ opacity: isFilled ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundImage: SPINE_GRADIENT }}
        />
        {/* Mint glow */}
        <motion.div
          animate={{ opacity: isFilled ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: '0 0 8px 2px rgba(66,245,200,.45)' }}
        />
      </div>

      {/* Pulse ring for the current (nearest-center) role */}
      {isCurrent && !reduce && (
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.75, 1], opacity: [0.75, 0, 0.75] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: -35, top: 20,
            width: 8, height: 8, borderRadius: '50%',
            border: '1.5px solid rgba(66,245,200,.7)',
            pointerEvents: 'none', zIndex: 2,
          }}
        />
      )}

      {/* Card */}
      <div
        className="glass-card overflow-hidden transition-colors duration-200"
        style={{ borderColor: isOpen ? `${exp.color}30` : undefined }}
      >
        <button
          ref={headerRef}
          id={headerId}
          className="w-full flex items-start justify-between gap-4 p-5 md:p-6 text-left min-h-[64px]"
          onClick={onToggle}
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
                <CompanyName name={exp.company} reduce={reduce} />
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: `${exp.color}18`, color: exp.color }}
                >
                  {exp.type}
                </span>
              </div>
              <div className="text-sm text-fg-muted mt-0.5">{exp.role}</div>
              <div className="mt-0.5">
                <DateReel value={exp.period} reduce={reduce} className="text-xs text-fg-muted" />
              </div>
            </div>
          </div>
          <ChevronDown
            size={16}
            className={`text-fg-muted flex-shrink-0 mt-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {reduce ? (
          isOpen && (
            <div id={bodyId} role="region" aria-labelledby={headerId}>
              {panelContent}
            </div>
          )
        ) : (
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                id={bodyId}
                role="region"
                aria-labelledby={headerId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{ overflow: 'hidden' }}
              >
                {panelContent}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </li>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function Experience() {
  const reduce = useReducedMotion()
  const [openSet, setOpenSet] = useState<Set<number>>(new Set([0, 1]))
  const listRef = useRef<HTMLOListElement>(null)

  const { scrollYProgress: spineProgress } = useScroll({
    target: listRef,
    offset: ['start 0.7', 'end 0.6'],
  })

  const toggle = (i: number) => setOpenSet(prev => {
    const next = new Set(prev)
    next.has(i) ? next.delete(i) : next.add(i)
    return next
  })

  const n = resume.experience.length

  return (
    <section id="experience" className="section bg-bg-2/30">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <span className="text-violet text-[13px] font-bold mb-3 block tracking-wide uppercase">
            <ScrambleText text="Experience" trigger="inView" />
          </span>
          <RevealHeading weight={700} className="text-4xl font-bold text-fg mb-12 leading-tight">
            Where I've shipped.
          </RevealHeading>
        </motion.div>

        {/* Spine + roles */}
        <div style={{ position: 'relative', paddingLeft: 32 }}>

          {/* Spine track (decorative) */}
          <div
            aria-hidden
            style={{ position: 'absolute', left: 0, top: 20, bottom: 20, width: 2, background: 'rgba(232,231,255,.08)' }}
          >
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: SPINE_GRADIENT,
                scaleY: reduce ? 1 : spineProgress,
                transformOrigin: 'top',
              }}
            />
          </div>

          <ol ref={listRef} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {resume.experience.map((exp, i) => (
              <RoleItem
                key={exp.company}
                exp={exp}
                index={i}
                n={n}
                spineProgress={spineProgress}
                isOpen={openSet.has(i)}
                onToggle={() => toggle(i)}
                reduce={!!reduce}
              />
            ))}
          </ol>
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.35, ease: EASE }}
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
