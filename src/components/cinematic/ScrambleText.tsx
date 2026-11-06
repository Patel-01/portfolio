import { useEffect, useRef, useState } from 'react'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#@$%&'
const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface Props {
  text: string
  trigger?: 'mount' | 'inView' | 'hover'
  className?: string
  style?: React.CSSProperties
}

export function ScrambleText({ text, trigger = 'mount', className, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  // hover trigger: start showing real text so touch devices are never blank
  const [display, setDisplay] = useState(() => (REDUCED || trigger === 'hover' ? text : ''))
  const rafRef = useRef<number>(0)
  const played = useRef(false)

  const play = () => {
    if (REDUCED) return
    played.current = true
    cancelAnimationFrame(rafRef.current)
    const chars = text.split('')
    const revealAt = chars.map((_, i) => i * 32 + Math.random() * 16)
    const end = (revealAt[revealAt.length - 1] ?? 0) + 80
    const t0 = performance.now()
    const tick = (now: number) => {
      const el = now - t0
      setDisplay(
        chars
          .map((c, i) => {
            if (c === ' ') return ' '
            return el >= revealAt[i] ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          })
          .join('')
      )
      if (el < end + 40) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    if (REDUCED) return
    const el = ref.current
    if (!el) return

    if (trigger === 'mount') {
      play()
      return
    }

    if (trigger === 'inView') {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            io.disconnect()
            play()
          }
        },
        { threshold: 0.1 }
      )
      io.observe(el)
      return () => io.disconnect()
    }

    if (trigger === 'hover') {
      const target = (el.closest('a, button, article') ?? el) as HTMLElement
      const handler = () => {
        played.current = false
        play()
      }
      target.addEventListener('mouseenter', handler)
      return () => target.removeEventListener('mouseenter', handler)
    }
  }, [trigger, text]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  if (REDUCED) {
    return (
      <span ref={ref} className={className} style={style}>
        {text}
      </span>
    )
  }

  return (
    <span
      ref={ref}
      className={className}
      style={{ ...style, display: 'inline-grid', position: 'relative' }}
    >
      {/* Real text for screen readers — position:absolute keeps it out of grid flow */}
      <span className="sr-only">{text}</span>
      {/* Hidden copy fixes layout width — prevents shifts from random glyph widths */}
      <span
        style={{ gridArea: '1/1', visibility: 'hidden', userSelect: 'none' }}
        aria-hidden="true"
      >
        {text}
      </span>
      <span style={{ gridArea: '1/1' }} aria-hidden="true">
        {display}
      </span>
    </span>
  )
}
