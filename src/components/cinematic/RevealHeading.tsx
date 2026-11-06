import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const GRADIENT = 'linear-gradient(135deg, rgb(110,85,255), rgb(66,245,200))'
const FONT = "'Inter Variable', Inter, system-ui, sans-serif"
const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface Props {
  children: string
  as?: 'h2' | 'h3' | 'p'
  srText?: string
  weight?: number
  gradient?: boolean
  className?: string
  style?: React.CSSProperties
}

export function RevealHeading({
  children,
  as: Tag = 'h2',
  srText,
  weight = 700,
  gradient = false,
  className,
  style: styleProp,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (REDUCED) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Gradient slicing: repaint every frame for 2s after trigger, then on resize
  useEffect(() => {
    if (!inView || !gradient) return
    const container = ref.current
    if (!container) return

    const paint = () => {
      const outers = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-rw-outer]'))
      const inners = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-rw-inner]'))
      const containerRect = container.getBoundingClientRect()
      const cw = container.offsetWidth
      const ch = container.offsetHeight
      outers.forEach((outer, idx) => {
        const inner = inners[idx]
        if (!inner) return
        const outerRect = outer.getBoundingClientRect()
        const xOff = outerRect.left - containerRect.left
        inner.style.backgroundSize = `${cw}px ${ch}px`
        inner.style.backgroundPosition = `-${xOff}px 0`
      })
    }

    paint()
    let rafId = 0
    const start = performance.now()
    const tick = () => {
      paint()
      if (performance.now() - start < 2000) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const ro = new ResizeObserver(paint)
    ro.observe(container)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [inView, gradient])

  const srLabel = srText ?? children

  if (REDUCED) {
    return (
      <Tag ref={ref as React.Ref<HTMLDivElement>} className={className} style={styleProp}>
        {srLabel}
      </Tag>
    )
  }

  const words = children.split(' ')

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      style={{ ...styleProp, display: 'block', position: 'relative' }}
    >
      {/* Real text for screen readers — sr-only takes it out of visual flow */}
      <span className="sr-only">{srLabel}</span>
      {words.map((word, i) => (
        <span
          key={i}
          data-rw-outer={i}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'bottom',
            marginRight: i < words.length - 1 ? '0.28em' : 0,
          }}
        >
          <motion.span
            data-rw-inner={i}
            initial={{ y: '115%', rotate: '8deg' }}
            animate={inView ? { y: '0%', rotate: '0deg' } : {}}
            transition={{
              duration: 0.65,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              display: 'inline-block',
              fontFamily: FONT,
              ...(gradient && {
                backgroundImage: GRADIENT,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                backgroundSize: '100% 100%',
                backgroundPosition: '0 0',
              }),
              fontVariationSettings: inView ? `'wght' ${weight}` : "'wght' 150",
              transition: `font-variation-settings 0.65s ${(i * 0.08 + 0.08).toFixed(2)}s cubic-bezier(0.22,1,0.36,1)`,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
