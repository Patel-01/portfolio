import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const GRADIENT = 'linear-gradient(135deg, rgb(110,85,255), rgb(66,245,200))'
const FONT = "'Inter Variable', Inter, system-ui, sans-serif"
const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function applySlice(el: HTMLSpanElement, x: number, cw: number, ch: number) {
  el.style.backgroundImage = GRADIENT
  el.style.backgroundSize = `${cw}px ${ch}px`
  el.style.backgroundPosition = `-${x}px 0`
  el.style.setProperty('-webkit-background-clip', 'text')
  el.style.backgroundClip = 'text'
  el.style.setProperty('-webkit-text-fill-color', 'transparent')
  el.style.color = 'transparent'
}

function DigitReel({ digit, delay }: { digit: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  // 20-item reel (0-9 × 2). After spin, the visible slot is 10 + digit.
  const reel = Array.from({ length: 20 }, (_, i) => i % 10)

  return (
    // data-rn-col: RollingNumber finds this span to measure column x offset
    <span
      ref={ref}
      data-rn-col=""
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        height: '1em',
        verticalAlign: 'top',
        fontVariantNumeric: 'tabular-nums',
        fontFamily: FONT,
        // No background or clip here — gradient lives on each digit span
      }}
    >
      <motion.span
        style={{ display: 'flex', flexDirection: 'column' }}
        initial={{ y: 0 }}
        animate={inView ? { y: `${-(10 + digit)}em` } : {}}
        transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {reel.map((d, i) => (
          // data-rn-digit: gradient is painted here — not affected by parent transform
          <span
            key={i}
            data-rn-digit=""
            style={{ display: 'block', height: '1em', lineHeight: 1 }}
          >
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

interface Props {
  value: number
  suffix?: string
  className?: string
  style?: React.CSSProperties
}

export function RollingNumber({ value, suffix = '', className, style }: Props) {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const apply = () => {
      const containerRect = container.getBoundingClientRect()
      const cw = container.offsetWidth
      const ch = container.offsetHeight

      // Gradient on static separators / suffix — background-clip:text is fine here (no transforms)
      Array.from(container.querySelectorAll<HTMLSpanElement>('[data-rn-slice]')).forEach((span) => {
        const x = span.getBoundingClientRect().left - containerRect.left
        applySlice(span, x, cw, ch)
      })

      // Gradient on each individual digit span inside each reel column.
      // All 20 digits in a column share the same x offset (they differ only in y via transform,
      // which does NOT affect background-clip origin — so each digit paints its own gradient slice
      // at the column's x position, regardless of the reel's animated y position).
      Array.from(container.querySelectorAll<HTMLSpanElement>('[data-rn-col]')).forEach((col) => {
        const x = col.getBoundingClientRect().left - containerRect.left
        Array.from(col.querySelectorAll<HTMLSpanElement>('[data-rn-digit]')).forEach((digit) => {
          applySlice(digit, x, cw, ch)
        })
      })
    }

    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(container)
    return () => ro.disconnect()
  }, [value, suffix])

  if (REDUCED) {
    return (
      <span className={className} style={style}>
        {value.toLocaleString()}{suffix}
      </span>
    )
  }

  const formatted = value.toLocaleString()
  const parts = formatted.split('').map((c) => ({ isDigit: /\d/.test(c), char: c }))
  let digitIndex = 0
  const totalDigits = parts.filter((p) => p.isDigit).length

  return (
    <span
      ref={containerRef}
      className={className}
      style={{ ...style, position: 'relative', fontVariantNumeric: 'tabular-nums', fontFamily: FONT }}
    >
      <span className="sr-only" style={{ position: 'absolute' }}>
        {value.toLocaleString()}{suffix}
      </span>
      {parts.map((part, i) => {
        if (!part.isDigit) {
          return (
            <span key={i} data-rn-slice="" style={{ display: 'inline-block' }}>
              {part.char}
            </span>
          )
        }
        const idx = digitIndex++
        return (
          <DigitReel
            key={i}
            digit={parseInt(part.char)}
            delay={idx * (0.55 / totalDigits)}
          />
        )
      })}
      {suffix && (
        <span data-rn-slice="" style={{ display: 'inline-block' }}>
          {suffix}
        </span>
      )}
    </span>
  )
}
