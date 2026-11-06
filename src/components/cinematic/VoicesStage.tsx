import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform,
  type MotionValue, type Variants,
} from 'framer-motion'
import { BRAND_GRADIENT, VAR_FONT } from './utils'
import { RevealHeading } from './RevealHeading'
import { ScrambleText } from './ScrambleText'

export type Voice = {
  name: string
  title: string
  relationship: string
  date: string
  quote: string
  initials?: string
  photo?: string
  linkedin?: string
  /** One strong sentence shown on stage. Defaults to the first sentence of the quote. */
  pull?: string
  /** Phrases inside `pull` that get the gradient marker. */
  highlight?: ReadonlyArray<string>
}

type Props = {
  items: ReadonlyArray<Voice>
  /** Prefix for relative photo paths, e.g. import.meta.env.BASE_URL. */
  photoBase?: string
  eyebrow?: string
  heading?: string
  /** Scroll distance per recommendation, in vh. */
  perItemVh?: number
}

const EASE = [0.16, 1, 0.3, 1] as const
const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}'-]/gu, '')
const firstSentence = (q: string) => (q.match(/^.*?[.!?](\s|$)/)?.[0] ?? q).trim()

/**
 * "Voices": a pinned stage instead of a card grid. While the section scrolls past,
 * one recommendation at a time takes the full width. Its words light up and gain
 * weight as you read; key phrases get a gradient marker; the next voice rises in
 * as the previous drops away. A story-style avatar index shows where you are.
 */
export function VoicesStage({
  items, photoBase = '/', eyebrow = 'Recommendations', heading = 'What colleagues say.', perItemVh = 60,
}: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const n = items.length
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [idx, setIdx] = useState(0)
  const [open, setOpen] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const narrow = useNarrow()

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(v * n)))
    setIdx((p) => (p === i ? p : i))
  })

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open !== null && !d.open) {
      d.showModal()
      d.querySelector<HTMLElement>(`[data-voice="${open}"]`)?.scrollIntoView({ block: 'start' })
    }
    if (open === null && d.open) d.close()
  }, [open])

  const jump = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + scrollY
    const travel = el.offsetHeight - innerHeight
    scrollTo({ top: top + travel * ((i + 0.75) / n), behavior: reduce ? 'auto' : 'smooth' })
  }

  const full = (
    <dialog
      ref={dialog}
      onClose={() => setOpen(null)}
      onClick={(e) => { if (e.target === dialog.current) setOpen(null) }}
      aria-label="All recommendations"
      data-voices-dialog=""
      style={{
        margin: 'auto', inset: 0,
        width: 'min(720px, calc(100vw - 2rem))', maxHeight: '82vh', padding: 0, border: '1px solid rgba(232,231,255,.1)',
        borderRadius: 20, background: '#0F0F16', color: 'rgb(232,231,255)', overflow: 'hidden',
      }}
    >
      <style>{'[data-voices-dialog]::backdrop{background:rgba(5,5,10,.72);backdrop-filter:blur(6px)}'}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(232,231,255,.08)' }}>
        <strong style={{ fontSize: 14 }}>{n} recommendations</strong>
        <button onClick={() => setOpen(null)} aria-label="Close" style={{ fontSize: 22, lineHeight: 1, padding: '4px 10px', opacity: 0.7 }}>×</button>
      </div>
      <div style={{ overflowY: 'auto', maxHeight: 'calc(82vh - 56px)', padding: '0.5rem 1.25rem 1.25rem' }}>
        {items.map((t, i) => (
          <figure key={t.name} data-voice={i} style={{ margin: 0, padding: '1.25rem 0', borderBottom: i < n - 1 ? '1px solid rgba(232,231,255,.08)' : undefined }}>
            <blockquote style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: 'rgb(186,184,214)' }}>{t.quote}</blockquote>
            <figcaption style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 14 }}>
              <Avatar v={t} base={photoBase} size={36} />
              <span style={{ fontSize: 13, lineHeight: 1.4 }}>
                <strong>{t.name}</strong> · {t.title}<br />
                <span style={{ color: 'rgb(140,120,255)' }}>{t.relationship} · {t.date}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </dialog>
  )

  if (reduce) {
    return (
      <section ref={ref} id="testimonials" className="section">
        <div className="max-w-6xl mx-auto px-6">
          <span className="text-violet text-[13px] font-bold mb-3 block tracking-wide uppercase">{eyebrow}</span>
          <h2 className="text-4xl font-bold text-fg mb-10 leading-tight">{heading}</h2>
          {items.map((t, i) => (
            <figure key={t.name} style={{ margin: '0 0 2.5rem' }}>
              <blockquote style={{ fontFamily: VAR_FONT, fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 600, lineHeight: 1.25 }}>
                "{t.pull ?? firstSentence(t.quote)}"
              </blockquote>
              <figcaption style={{ marginTop: 10, fontSize: 14, color: 'rgb(160,158,190)' }}>
                {t.name}, {t.title} · <button onClick={() => setOpen(i)} style={{ color: 'rgb(140,120,255)' }}>Read in full</button>
              </figcaption>
            </figure>
          ))}
        </div>
        {full}
      </section>
    )
  }

  const t = items[idx]
  return (
    <section ref={ref} id="testimonials" aria-label={eyebrow} style={{ position: 'relative', height: `calc(${n * perItemVh}vh + 100svh)` }}>
      <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>
        <div
          className="max-w-6xl mx-auto px-6"
          style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 'clamp(80px, 12vh, 120px)', paddingBottom: 'clamp(24px, 5vh, 48px)' }}
        >
          {/* Header row */}
          {narrow ? (
            <div>
              <span className="text-violet text-[13px] font-bold mb-3 block tracking-wide uppercase">
                <ScrambleText text={eyebrow} trigger="inView" />
              </span>
              <RevealHeading className="text-2xl font-bold text-fg leading-tight" lines={heading} weight={700} />
              <div style={{ marginTop: 8 }}><Counter idx={idx} n={n} /></div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
              <div>
                <span className="text-violet text-[13px] font-bold mb-3 block tracking-wide uppercase">
                  <ScrambleText text={eyebrow} trigger="inView" />
                </span>
                <RevealHeading className="text-3xl sm:text-4xl font-bold text-fg leading-tight" lines={heading} weight={700} />
              </div>
              <Counter idx={idx} n={n} />
            </div>
          )}

          {/* Stage */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
            <div aria-hidden style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(4.5rem, 10vw, 8rem)', lineHeight: 0.8, height: '0.5em', fontWeight: 700, backgroundImage: BRAND_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', width: 'fit-content' }}>
              {'“'}
            </div>
            {/* Grid: ghost pulls establish max height at current width; live pull overlays in same cell */}
            <div style={{ display: 'grid' }}>
              {items.map((voice) => (
                <p
                  key={voice.name}
                  aria-hidden
                  style={{
                    gridArea: '1/1', visibility: 'hidden', pointerEvents: 'none',
                    fontFamily: VAR_FONT, fontSize: narrow ? 'clamp(1.3rem, 4.5vw, 3.25rem)' : 'clamp(1.55rem, 3.7vw, 3.25rem)',
                    lineHeight: 1.16, letterSpacing: '-0.02em', maxWidth: '26ch', margin: 0,
                  }}
                >
                  {voice.pull ?? firstSentence(voice.quote)}
                </p>
              ))}
              <div style={{ gridArea: '1/1' }}>
                <AnimatePresence mode="wait" initial={false}>
                  <Pull key={idx} voice={t} idx={idx} n={n} progress={scrollYProgress} narrow={narrow} />
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: 0.25 } }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                style={{ display: 'flex', alignItems: 'center', gap: narrow ? 10 : 14, marginTop: narrow ? 'clamp(10px, 2vh, 18px)' : 'clamp(18px, 4vh, 36px)', flexWrap: narrow ? 'nowrap' : 'wrap', minHeight: narrow ? 64 : undefined }}
              >
                <Avatar v={t} base={photoBase} size={narrow ? 36 : 44} />
                <div style={{ lineHeight: 1.35, minWidth: 0, flex: narrow ? 1 : undefined }}>
                  <div className="text-fg" style={{ fontWeight: 600, fontSize: narrow ? 13 : 15 }}>{t.name}</div>
                  <div className="text-fg-muted" style={{ fontSize: narrow ? 11 : 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: narrow ? 'nowrap' : undefined }}>{t.title}</div>
                  <div style={{ fontSize: narrow ? 11 : 12, color: 'rgb(140,120,255)', fontWeight: 500 }}>{t.relationship} · {t.date}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginLeft: narrow ? undefined : 'auto', flexShrink: 0 }}>
                  {t.linkedin && (
                    <a href={t.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${t.name} on LinkedIn`} className="text-fg-muted hover:text-fg"
                      style={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: 12, border: '1px solid rgba(232,231,255,.1)' }}>
                      <LinkedInIcon />
                    </a>
                  )}
                  {narrow ? (
                    <button onClick={() => setOpen(idx)} className="text-fg"
                      aria-label={`Read full recommendation from ${t.name}`}
                      style={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: 12, border: '1px solid rgba(232,231,255,.1)', fontSize: 16 }}>
                      ↗
                    </button>
                  ) : (
                    <button onClick={() => setOpen(idx)} className="text-fg"
                      style={{ height: 40, padding: '0 14px', borderRadius: 12, border: '1px solid rgba(232,231,255,.1)', fontSize: 13, fontWeight: 600 }}>
                      Read in full →
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Story-style index */}
          <nav aria-label="Recommendations" style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, gap: 8 }}>
            {items.map((v, i) => (
              <IndexItem key={v.name} v={v} i={i} n={n} active={i === idx} progress={scrollYProgress} base={photoBase} onClick={() => jump(i)} />
            ))}
          </nav>
        </div>
      </div>
      {full}
    </section>
  )
}

/* ---------- pieces ---------- */

const word: Variants = {
  hidden: { y: '110%' },
  enter: (i: number) => ({ y: '0%', transition: { duration: 0.75, ease: EASE, delay: i * 0.014 } }),
  exit: (i: number) => ({ y: '-110%', transition: { duration: 0.32, ease: [0.4, 0, 1, 1], delay: i * 0.006 } }),
}

function Pull({ voice, idx, n, progress, narrow }: { voice: Voice; idx: number; n: number; progress: MotionValue<number>; narrow: boolean }) {
  const text = voice.pull ?? firstSentence(voice.quote)
  const words = text.split(/\s+/)
  const marked = new Set<number>()
  voice.highlight?.forEach((ph) => {
    const pw = ph.split(/\s+/).map(norm)
    for (let i = 0; i + pw.length <= words.length; i++) {
      if (pw.every((w, k) => norm(words[i + k]) === w)) pw.forEach((_, k) => marked.add(i + k))
    }
  })
  const local = useTransform(progress, (v) => clamp01(v * n - idx))
  return (
    <motion.p
      initial="hidden"
      animate="enter"
      exit="exit"
      style={{
        fontFamily: VAR_FONT, fontSize: narrow ? 'clamp(1.3rem, 4.5vw, 3.25rem)' : 'clamp(1.55rem, 3.7vw, 3.25rem)', lineHeight: 1.16, letterSpacing: '-0.02em',
        maxWidth: '26ch', margin: 0, color: 'rgb(232,231,255)',
      }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Word key={i} i={i} total={words.length} local={local} marked={marked.has(i)} markedNext={marked.has(i + 1)}>{w}</Word>
        ))}
      </span>
    </motion.p>
  )
}

function Word({ children, i, total, local, marked, markedNext }: { children: string; i: number; total: number; local: MotionValue<number>; marked: boolean; markedNext: boolean }) {
  const start = (i / total) * 0.62
  const end = start + 0.62 / total + 0.06
  const opacity = useTransform(local, [start, end], [0.16, 1])
  const fvs = useTransform(local, [start, end], [`'wght' 300`, `'wght' ${marked ? 800 : 560}`])
  const marker = useTransform(local, [end, end + 0.12], ['0% 0.1em', '100% 0.1em'])
  // When this marked word is followed by another marked word, include the space inside
  // the motion.span so the gradient underline runs unbroken across the whole phrase.
  const bridgeSpace = marked && markedNext
  return (
    <>
      <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
        <motion.span
          variants={word}
          custom={i}
          style={{
            display: 'inline-block', opacity, fontVariationSettings: fvs,
            ...(marked ? { backgroundImage: BRAND_GRADIENT, backgroundRepeat: 'no-repeat', backgroundPosition: '0 96%', backgroundSize: marker } : {}),
          }}
        >
          {children}{bridgeSpace ? ' ' : ''}
        </motion.span>
      </span>{bridgeSpace ? null : ' '}
    </>
  )
}

function Counter({ idx, n }: { idx: number; n: number }) {
  const pad = (v: number) => String(v).padStart(2, '0')
  return (
    <div aria-hidden style={{ fontFamily: VAR_FONT, fontVariantNumeric: 'tabular-nums', fontSize: 14, color: 'rgb(160,158,190)', display: 'flex', alignItems: 'baseline', gap: 6, flexShrink: 0 }}>
      <span style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', height: '1.6em', minWidth: '1.4em', fontSize: 28, fontWeight: 800, color: 'rgb(232,231,255)' }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={idx} style={{ display: 'block', lineHeight: '1.6em' }}
            initial={{ y: '100%' }} animate={{ y: '0%' }} exit={{ y: '-100%' }} transition={{ duration: 0.45, ease: EASE }}>
            {pad(idx + 1)}
          </motion.span>
        </AnimatePresence>
      </span>
      / {pad(n)}
    </div>
  )
}

function IndexItem({ v, i, n, active, progress, base, onClick }: {
  v: Voice; i: number; n: number; active: boolean; progress: MotionValue<number>; base: string; onClick: () => void
}) {
  const fill = useTransform(progress, (p) => clamp01(p * n - i))
  const wide = useWide()
  return (
    <button onClick={onClick} aria-label={`Show recommendation from ${v.name}`} aria-current={active || undefined}
      style={{ textAlign: 'left', display: 'grid', gap: 8, padding: '6px 0', minWidth: 0 }}>
      <span style={{ height: 2, borderRadius: 2, background: 'rgba(232,231,255,.12)', overflow: 'hidden', display: 'block' }}>
        <motion.span style={{ display: 'block', height: '100%', background: BRAND_GRADIENT, transformOrigin: '0 50%', scaleX: fill }} />
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, opacity: active ? 1 : 0.45, transition: 'opacity .3s' }}>
        <Avatar v={v} base={base} size={26} />
        {wide && (
          <span className="text-fg" style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {v.name.split(' ')[0]}
          </span>
        )}
      </span>
    </button>
  )
}

function useNarrow(query = '(max-width: 359px)') {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && matchMedia(query).matches)
  useEffect(() => {
    const m = matchMedia(query)
    const on = () => setNarrow(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return narrow
}

function useWide(query = '(min-width: 768px)') {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && matchMedia(query).matches)
  useEffect(() => {
    const m = matchMedia(query)
    const on = () => setWide(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return wide
}

function Avatar({ v, base, size }: { v: Voice; base: string; size: number }) {
  const [failed, setFailed] = useState(false)
  const initials = v.initials ?? v.name.split(' ').map((p) => p[0]).join('').slice(0, 2)
  const box = { width: size, height: size, borderRadius: '50%', flexShrink: 0 } as const
  if (v.photo && !failed) {
    return <img src={`${base}${v.photo}`} alt="" width={size} height={size} onError={() => setFailed(true)}
      style={{ ...box, objectFit: 'cover', border: '1.5px solid rgba(140,120,255,.4)' }} />
  }
  return (
    <span aria-hidden style={{ ...box, display: 'grid', placeItems: 'center', fontSize: size * 0.36, fontWeight: 700, color: 'rgb(232,231,255)', background: 'rgba(110,85,255,.18)', border: '1.5px solid rgba(140,120,255,.4)' }}>
      {initials}
    </span>
  )
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 21 11 21 14.1V21h-4v-6.1c0-1.45-.03-3.32-2.02-3.32-2.03 0-2.34 1.58-2.34 3.21V21H9z" />
    </svg>
  )
}
