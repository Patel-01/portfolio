import { useRef } from 'react'
import {
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useAnimationFrame,
  motion,
} from 'framer-motion'

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// What I do (outline row, top)
const WORDS_TOP = ['AI PRODUCTS', 'MOBILE APPS', 'REAL-TIME SYNC', 'SHIPPED DAILY', 'OPEN SOURCE']
// The stack (gradient row, bottom)
const WORDS_BOTTOM = ['REACT NATIVE', 'TYPESCRIPT', 'PYTHON', 'NODE.JS', 'CLAUDE CODE', 'LLM AGENTS']
const GRADIENT = 'linear-gradient(135deg, rgb(110,85,255), rgb(66,245,200))'
const VIOLET = 'rgb(110,85,255)'

const BASE_STYLE: React.CSSProperties = {
  fontSize: 'clamp(3rem, 9vw, 8.5rem)',
  fontWeight: 900,
  letterSpacing: '-0.04em',
  lineHeight: 1,
  textTransform: 'uppercase',
  display: 'inline-block',
  paddingRight: '0.35em',
  whiteSpace: 'nowrap',
}

function Row({
  words,
  direction,
  filled,
  skewX,
}: {
  words: string[]
  direction: 1 | -1
  filled: boolean
  skewX: ReturnType<typeof useTransform<number, number>>
}) {
  const xRef = useRef(0)
  const initialized = useRef(false)
  const trackRef = useRef<HTMLDivElement>(null)

  useAnimationFrame((_, delta) => {
    if (REDUCED) return
    const track = trackRef.current
    if (!track) return
    const contentW = track.children[0]
      ? (track.children[0] as HTMLElement).offsetWidth
      : 0
    if (!contentW) return

    // For direction=1 (rightward), the track must start at -contentW so
    // the viewport is never left of the track content. xRef travels from
    // -contentW → 0, then wraps back to -contentW.
    if (!initialized.current) {
      if (direction === 1) xRef.current = -contentW
      initialized.current = true
    }

    xRef.current += direction * 0.038 * delta

    // Always keep xRef in (-contentW, 0] for seamless looping in both directions
    if (xRef.current >= 0) xRef.current -= contentW
    if (xRef.current < -contentW) xRef.current += contentW

    track.style.transform = `translateX(${xRef.current}px)`
  })

  // 4 repetitions for seamless loop
  const reps = Array.from({ length: 4 })

  return (
    <motion.div
      style={{ overflow: 'hidden', whiteSpace: 'nowrap', skewX }}
      aria-hidden="true"
    >
      <div ref={trackRef} style={{ display: 'inline-flex', userSelect: 'none' }}>
        {reps.map((_, ri) => (
          <span key={ri} style={{ display: 'inline-flex', alignItems: 'baseline' }}>
            {words.map((word, wi) => (
              <span key={wi} style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                <span
                  style={{
                    ...BASE_STYLE,
                    ...(filled
                      ? {
                          backgroundImage: GRADIENT,
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                        }
                      : {
                          // Explicit stroke color — not currentColor, which would match the
                          // background fill (#0A0A0F) and make the outline invisible
                          WebkitTextStroke: '3px rgba(232, 231, 255, 0.32)',
                          color: '#0A0A0F',
                          paintOrder: 'stroke fill',
                          transition: 'color 0.18s ease',
                        }),
                  }}
                  onMouseEnter={
                    filled
                      ? undefined
                      : (e) => {
                          ;(e.currentTarget as HTMLSpanElement).style.color =
                            'rgba(232,231,255,0.85)'
                        }
                  }
                  onMouseLeave={
                    filled
                      ? undefined
                      : (e) => {
                          ;(e.currentTarget as HTMLSpanElement).style.color = '#0A0A0F'
                        }
                  }
                >
                  {word}
                </span>
                {/* ✦ separator in violet */}
                <span
                  style={{
                    ...BASE_STYLE,
                    paddingRight: '0.35em',
                    paddingLeft: '0.05em',
                    color: VIOLET,
                    fontSize: 'clamp(1.5rem, 4.5vw, 4.5rem)',
                    ...(filled && { color: VIOLET }),
                  }}
                >
                  ✦
                </span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export function VelocityMarquee() {
  const { scrollY } = useScroll()
  const rawVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(rawVelocity, { damping: 50, stiffness: 400 })
  const skewX = useTransform(smoothVelocity, [-3000, 3000], [-14, 14])

  if (REDUCED) {
    return <div aria-hidden="true" style={{ height: '1px', overflow: 'hidden' }} />
  }

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '32px 0',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
      }}
    >
      <Row words={WORDS_TOP} direction={-1} filled={false} skewX={skewX} />
      <div style={{ height: '12px' }} />
      <Row words={WORDS_BOTTOM} direction={1} filled={true} skewX={skewX} />
    </div>
  )
}
