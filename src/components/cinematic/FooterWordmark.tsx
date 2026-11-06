import { useEffect, useRef } from 'react'

const GRADIENT = 'linear-gradient(135deg, rgb(110,85,255), rgb(66,245,200))'
const FONT = "'Inter Variable', Inter, system-ui, sans-serif"
const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t))
  return c * c * (3 - 2 * c)
}

interface Props {
  text?: string
}

export function FooterWordmark({ text = 'PANKAJ' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (REDUCED) return
    const container = containerRef.current
    if (!container) return
    const isTouch = window.matchMedia('(pointer: coarse)').matches

    const letters = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-fw]'))
    const N = letters.length

    const wMap = new Map<HTMLSpanElement, number>(letters.map((s) => [s, 100]))
    let ptrX = -9999, ptrY = -9999
    let fullyInked = false
    let lensRunning = false
    let animId = 0

    const updateGradients = () => {
      const lw = container.offsetWidth
      const lh = container.offsetHeight
      letters.forEach((span) => {
        span.style.backgroundSize = `${lw}px ${lh}px`
        span.style.backgroundPosition = `-${span.offsetLeft}px 0`
      })
    }

    const lensTarget = (span: HTMLSpanElement) => {
      const rect = span.getBoundingClientRect()
      const dist = Math.hypot(ptrX - (rect.left + rect.width / 2), ptrY - (rect.top + rect.height / 2))
      const R = 220
      if (dist >= R) return 900
      return 900 - 720 * (1 - dist / R)
    }

    const scrollLoop = () => {
      const rect = container.getBoundingClientRect()
      // Clamp progress to 0-1; at max scroll the wordmark is fully in view → p ≥ 1
      const rawP = (window.innerHeight - rect.top) / rect.height
      const p = Math.max(0, Math.min(1, rawP))

      let changed = false
      letters.forEach((span, i) => {
        // Left-to-right stagger: letter i starts early, completes at p=1
        const localP = smoothstep(Math.max(0, Math.min(1, p * 1.3 - (i / N) * 0.3)))
        const targetW = 100 + 800 * localP

        const curW = wMap.get(span) ?? 100
        if (Math.abs(targetW - curW) > 0.3) changed = true
        wMap.set(span, targetW)
        span.style.fontVariationSettings = `'wght' ${targetW}`
      })

      if (changed) updateGradients()

      // Check if fully inked
      if (!fullyInked && p >= 1) fullyInked = true

      animId = requestAnimationFrame(scrollLoop)
    }

    const lensLoop = () => {
      let changed = false
      letters.forEach((span) => {
        const targetW = lensTarget(span)
        const curW = wMap.get(span) ?? 900
        const nw = curW + (targetW - curW) * 0.12
        if (Math.abs(nw - curW) > 0.3) changed = true
        wMap.set(span, nw)
        span.style.fontVariationSettings = `'wght' ${nw}`
      })
      if (changed) updateGradients()
      lensRunning = true
      animId = requestAnimationFrame(lensLoop)
    }

    // Start scroll-driven loop
    animId = requestAnimationFrame(scrollLoop)

    // Pointer on the CONTAINER triggers lens (not window, so it only fires when over the wordmark)
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      ptrX = e.clientX
      ptrY = e.clientY
      if (fullyInked && !lensRunning) {
        // Switch from scroll loop to lens loop
        cancelAnimationFrame(animId)
        lensLoop()
      }
    }
    const onPointerLeave = () => {
      if (!fullyInked) return
      lensRunning = false
      cancelAnimationFrame(animId)
      // Spring back to 900
      const springBack = () => {
        let settled = true
        letters.forEach(span => {
          const curW = wMap.get(span) ?? 900
          const nw = curW + (900 - curW) * 0.12
          if (Math.abs(nw - 900) > 0.5) settled = false
          wMap.set(span, nw)
          span.style.fontVariationSettings = `'wght' ${nw}`
        })
        updateGradients()
        if (!settled) animId = requestAnimationFrame(springBack)
      }
      animId = requestAnimationFrame(springBack)
    }

    if (!isTouch) {
      container.addEventListener('pointermove', onPointer)
      container.addEventListener('pointerleave', onPointerLeave)
    }

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('pointermove', onPointer)
      container.removeEventListener('pointerleave', onPointerLeave)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (REDUCED) {
    return (
      <div
        aria-hidden="true"
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: '24vw',
          lineHeight: 0.85,
          letterSpacing: '-0.055em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          backgroundImage: GRADIENT,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          userSelect: 'none',
        }}
      >
        {text}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'relative',
        display: 'block',
        fontSize: '24vw',
        lineHeight: 0.85,
        letterSpacing: '-0.055em',
        whiteSpace: 'nowrap',  // prevents J wrapping when weight reaches 900
        overflow: 'hidden',
        userSelect: 'none',
        fontFamily: FONT,
        cursor: 'default',
      }}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          data-fw={i}
          style={{
            display: 'inline-block',
            fontFamily: FONT,
            fontVariationSettings: "'wght' 100",
            backgroundImage: GRADIENT,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {char}
        </span>
      ))}
    </div>
  )
}
