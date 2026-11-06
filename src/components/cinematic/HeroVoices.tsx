import { Fragment, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform, type MotionValue, type Variants } from 'framer-motion'
import { BRAND_GRADIENT, VAR_FONT } from './utils'

export type HeroVoice = {
  name: string
  /** Short role shown after the name, e.g. "Tech Lead". */
  role: string
  /** A short, verbatim fragment from their recommendation (≈ 40–60 chars). */
  fragment: string
  photo?: string
  initials?: string
}

type Props = {
  items: HeroVoice[]
  /** Total recommendations, for the link label. */
  total?: number
  /** Where the link goes. */
  href?: string
  photoBase?: string
  /** Seconds each voice stays. */
  hold?: number
  className?: string
}

const EASE = [0.16, 1, 0.3, 1] as const

const word: Variants = {
  hidden: { y: '105%' },
  enter: (i: number) => ({ y: '0%', transition: { duration: 0.6, ease: EASE, delay: 0.05 + i * 0.03 } }),
  exit: (i: number) => ({ y: '-105%', transition: { duration: 0.28, ease: [0.4, 0, 1, 1], delay: i * 0.012 } }),
}

/**
 * First-impression social proof for the hero: an avatar stack and one short,
 * verbatim fragment at a time. The gradient marker under the quote doubles as the
 * timer: when it's full, the next voice rises in. Pauses on hover/focus, has an
 * explicit pause control, and is static under reduced motion.
 */
export function HeroVoices({ items, total, href = '#testimonials', photoBase = '/', hold = 4.8, className }: Props) {
  const reduce = useReducedMotion()
  const narrow = useNarrow()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hover, setHover] = useState(false)
  const t = useMotionValue(0)
  const visible = useRef(true)
  const root = useRef<HTMLDivElement>(null)

  // Don't burn cycles (or skip voices) while the hero is off-screen.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useAnimationFrame((_, delta) => {
    if (reduce || paused || hover || !visible.current) return
    const next = t.get() + delta / 1000 / hold
    if (next >= 1) { t.set(0); setI((v) => (v + 1) % items.length) } else t.set(next)
  })

  const v = items[i]
  const count = total ?? items.length
  const words = `“${v.fragment}”`.split(' ')

  return (
    <div
      ref={root}
      className={className}
      role="group"
      aria-label="What colleagues say"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{ display: 'flex', flexDirection: narrow ? 'column' : 'row', alignItems: narrow ? 'flex-start' : 'center', gap: 14, width: '100%', minWidth: 0, maxWidth: 520 }}
    >
      {/* Avatar stack: the active voice comes forward */}
      <a href={href} aria-label={`Read ${count} recommendations`} style={{ display: 'flex', flexShrink: 0, paddingLeft: 8 }}>
        {items.map((p, k) => (
          <motion.span
            key={p.name}
            animate={{ scale: k === i ? 1.12 : 1, opacity: k === i || reduce ? 1 : 0.55, zIndex: k === i ? 2 : 1 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ marginLeft: -8, position: 'relative', borderRadius: '50%', boxShadow: '0 0 0 2px #0A0A0F' }}
          >
            <Face p={p} base={photoBase} active={k === i} />
          </motion.span>
        ))}
      </a>

      <div style={{ minWidth: 0, flex: 1 }}>
        {/* Screen readers get the full set once, not a rotating feed */}
        <span className="sr-only">
          Recommended by {items.map((p) => `${p.name} (${p.role})`).join(', ')}.
        </span>

        <a href={href} aria-hidden tabIndex={-1} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
          {/* Ghost grid: all fragments rendered invisible so the cell is always as tall as the longest one */}
          <div style={{ display: 'grid', fontFamily: VAR_FONT, fontSize: 15, lineHeight: 1.35, color: 'rgb(232,231,255)' }}>
            {items.map((item) => (
              <span key={item.name} aria-hidden style={{ gridArea: '1/1', visibility: 'hidden', pointerEvents: 'none' }}>
                {`"${item.fragment}"`}
              </span>
            ))}
            <span style={{ gridArea: '1/1' }}>
              <AnimatePresence mode="wait" initial={false}>
                <QuoteLine key={i} words={words} t={t} reduce={!!reduce} />
              </AnimatePresence>
            </span>
          </div>
        </a>

        {/* wraps on phones: a nowrap row here would force the hero column wider than the screen */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: 8, rowGap: 2, marginTop: 6, fontSize: 12, color: 'rgb(160,158,190)' }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }}
              aria-hidden style={{ whiteSpace: narrow ? 'normal' : 'nowrap' }}>
              <span style={{ whiteSpace: 'nowrap' }}>— <span style={{ color: 'rgb(232,231,255)', fontWeight: 600 }}>{v.name}</span></span> · {v.role}
            </motion.span>
          </AnimatePresence>
          <span aria-hidden style={{ opacity: 0.4 }}>·</span>
          <a href={href} style={{ color: 'rgb(140,120,255)', fontWeight: 600 }}>{count} recommendations →</a>
          {!reduce && (
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Play recommendations' : 'Pause recommendations'}
              aria-pressed={paused}
              style={{ display: 'grid', placeItems: 'center', width: 24, height: 24, borderRadius: 6, marginLeft: 2, opacity: 0.6 }}
            >
              {paused ? (
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden><path d="M2 1l7 4-7 4z" fill="currentColor" /></svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden><path d="M2 1h2v8H2zM6 1h2v8H6z" fill="currentColor" /></svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/** One voice's fragment. The marker sweeps word by word, left to right, as the timer runs. */
function QuoteLine({ words, t, reduce }: { words: string[]; t: MotionValue<number>; reduce: boolean }) {
  return (
    <motion.span initial="hidden" animate="enter" exit="exit" style={{ display: 'block' }}>
      {words.map((w, k) => (
        <Fragment key={k}>
          {/* clip only vertically, so the marker can run under the following space */}
          <span style={{ display: 'inline-block', verticalAlign: 'bottom', clipPath: 'inset(-0.1em -1em -0.16em -0.1em)', paddingBottom: '0.14em', marginBottom: '-0.14em' }}>
            <QuoteWord w={w} k={k} n={words.length} t={t} reduce={reduce} />
          </span>
          {k < words.length - 1 && ' '}
        </Fragment>
      ))}
    </motion.span>
  )
}

function QuoteWord({ w, k, n, t, reduce }: { w: string; k: number; n: number; t: MotionValue<number>; reduce: boolean }) {
  const size = useTransform(t, [k / n, (k + 1) / n], ['0% 0.09em', '100% 0.09em'])
  const last = k === n - 1
  return (
    <motion.span
      variants={word}
      custom={k}
      style={{
        display: 'inline-block', fontVariationSettings: "'wght' 520",
        paddingRight: last ? 0 : '0.27em', marginRight: last ? 0 : '-0.27em',
        backgroundImage: BRAND_GRADIENT, backgroundRepeat: 'no-repeat', backgroundPosition: '0 100%',
        backgroundSize: reduce ? '100% 0.09em' : size,
      }}
    >
      {w}
    </motion.span>
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

function Face({ p, base, active }: { p: HeroVoice; base: string; active: boolean }) {
  const [failed, setFailed] = useState(false)
  const size = 30
  const ring = active ? '1.5px solid rgb(66,245,200)' : '1.5px solid rgba(140,120,255,.35)'
  if (p.photo && !failed) {
    return <img src={`${base}${p.photo}`} alt="" width={size} height={size} onError={() => setFailed(true)}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: ring, display: 'block' }} />
  }
  const initials = p.initials ?? p.name.split(' ').map((s) => s[0]).join('').slice(0, 2)
  return (
    <span style={{ width: size, height: size, borderRadius: '50%', border: ring, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, background: 'rgba(110,85,255,.2)', color: 'rgb(232,231,255)' }}>
      {initials}
    </span>
  )
}
