import { Fragment, useEffect, useRef } from 'react'

const GRADIENT = 'linear-gradient(135deg, rgb(110,85,255), rgb(66,245,200))'
const FONT = "'Inter Variable', Inter, system-ui, sans-serif"
const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export interface HeadlineLine {
  text: string
  gradient?: boolean
}

interface Props {
  lines: HeadlineLine[]
  as?: 'h1' | 'div'
  className?: string
}

export function KineticHeadline({ lines, as: Tag = 'div', className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (REDUCED) return
    const container = containerRef.current
    if (!container) return
    const isTouch = window.matchMedia('(pointer: coarse)').matches

    const lineEls = Array.from(
      container.querySelectorAll<HTMLDivElement>('[data-kline]')
    )
    const lettersByLine: HTMLSpanElement[][] = lineEls.map((lineEl) =>
      Array.from(lineEl.querySelectorAll<HTMLSpanElement>('[data-kletter]'))
    )

    const wMap = new Map<HTMLSpanElement, number>()
    const yMap = new Map<HTMLSpanElement, number>()
    lettersByLine.forEach((letters) =>
      letters.forEach((s) => {
        wMap.set(s, 100)
        yMap.set(s, 20)
      })
    )

    const updateGradients = () => {
      lineEls.forEach((lineEl, li) => {
        if (!lines[li].gradient) return
        const lw = lineEl.offsetWidth
        const lh = lineEl.offsetHeight
        // getBoundingClientRect gives viewport-relative coords; letters may be inside
        // per-word wrapper spans so offsetLeft alone is no longer relative to lineEl
        const lineLeft = lineEl.getBoundingClientRect().left
        lettersByLine[li].forEach((span) => {
          const xOff = span.getBoundingClientRect().left - lineLeft
          span.style.backgroundSize = `${lw}px ${lh}px`
          span.style.backgroundPosition = `-${xOff}px 0`
        })
      })
    }

    // Repaint gradients on resize
    const onResize = () => updateGradients()
    window.addEventListener('resize', onResize)

    const getDelay = (i: number, total: number) =>
      Math.abs(i - (total - 1) / 2) * 0.055

    const INTRO_DUR = 0.65
    let introStart = 0

    let phase: 'intro' | 'lens' = 'intro'
    let mouseX = -9999
    let mouseY = -9999
    let lastMouseTime = 0
    let lensRunning = false
    let animId = 0

    const lensTarget = (span: HTMLSpanElement) => {
      const rect = span.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dist = Math.hypot(mouseX - cx, mouseY - cy)
      const R = 170
      if (dist >= R) return { w: 900, y: 0 }
      const t = 1 - dist / R
      return { w: 900 - 720 * t, y: -3 * t }
    }

    const loop = (now: number) => {
      if (phase === 'intro') {
        const elapsed = (now - introStart) / 1000
        let done = true

        lineEls.forEach((lineEl, li) => {
          const letters = lettersByLine[li]
          const isGrad = lines[li].gradient
          let maxBlur = 0

          letters.forEach((span, si) => {
            const delay = getDelay(si, letters.length)
            const t = Math.max(0, Math.min(1, (elapsed - delay) / INTRO_DUR))
            const e = 1 - Math.pow(1 - t, 3)

            const w = 100 + 800 * e
            const y = 20 * (1 - e)
            const blur = 4 * (1 - e)

            wMap.set(span, w)
            yMap.set(span, y)
            span.style.fontVariationSettings = `'wght' ${w}`
            span.style.transform = `translateY(${y}px)`
            span.style.opacity = String(e)

            if (!isGrad) {
              span.style.filter = blur > 0.1 ? `blur(${blur}px)` : ''
            } else {
              maxBlur = Math.max(maxBlur, blur)
            }
            if (t < 1) done = false
          })

          if (isGrad) {
            lineEl.style.filter = maxBlur > 0.1 ? `blur(${maxBlur}px)` : ''
          }
        })

        updateGradients()

        if (done) {
          lineEls.forEach((lineEl) => (lineEl.style.filter = ''))
          phase = 'lens'
          return
        }

        animId = requestAnimationFrame(loop)
      } else {
        if (now - lastMouseTime > 2000) {
          lensRunning = false
          return
        }

        let needsGrad = false
        lineEls.forEach((_lineEl, li) => {
          const letters = lettersByLine[li]
          letters.forEach((span) => {
            const tgt = lensTarget(span)
            const curW = wMap.get(span) ?? 900
            const curY = yMap.get(span) ?? 0
            const nw = curW + (tgt.w - curW) * 0.12
            const ny = curY + (tgt.y - curY) * 0.12

            wMap.set(span, nw)
            yMap.set(span, ny)
            span.style.fontVariationSettings = `'wght' ${nw}`
            span.style.transform = `translateY(${ny}px)`

            if (lines[li].gradient && Math.abs(nw - curW) > 0.5) needsGrad = true
          })
        })

        if (needsGrad) updateGradients()
        animId = requestAnimationFrame(loop)
      }
    }

    // Wait for fonts before measuring or starting the intro
    document.fonts.ready.then(() => {
      introStart = performance.now()
      animId = requestAnimationFrame(loop)
    })

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      mouseX = e.clientX
      mouseY = e.clientY
      lastMouseTime = performance.now()
      if (phase === 'lens' && !lensRunning) {
        lensRunning = true
        animId = requestAnimationFrame(loop)
      }
    }

    if (!isTouch) window.addEventListener('pointermove', onMove)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fullText = lines.map((l) => l.text).join(' ')

  // Static render
  if (REDUCED) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: 'block' }}>
            <span
              style={{
                fontFamily: FONT,
                ...(line.gradient && {
                  backgroundImage: GRADIENT,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }),
              }}
            >
              {line.text}
            </span>
          </div>
        ))}
      </Tag>
    )
  }

  // Animated render — real heading element for screen readers
  return (
    <Tag ref={containerRef as React.Ref<HTMLDivElement>} className={className}>
      {/* Real text for screen readers and search engines */}
      <span className="sr-only">{fullText}</span>
      {lines.map((line, li) => {
        const words = line.text.split(' ')
        return (
          <div
            key={li}
            data-kline={li}
            aria-hidden="true"
            style={{ display: 'block', position: 'relative', lineHeight: 'inherit' }}
          >
            {words.map((word, wi) => (
              <Fragment key={wi}>
                {/* Space between words — inline text node so the browser breaks here */}
                {wi > 0 && ' '}
                {/* Per-word nowrap wrapper — prevents mid-word line breaks on mobile */}
                <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                  {word.split('').map((char, ci) => (
                    <span
                      key={ci}
                      data-kletter=""
                      style={{
                        display: 'inline-block',
                        fontFamily: FONT,
                        fontVariationSettings: "'wght' 100",
                        opacity: 0,
                        transform: 'translateY(20px)',
                        ...(line.gradient && {
                          backgroundImage: GRADIENT,
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                        }),
                        ...(!line.gradient && { color: 'inherit' }),
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </div>
        )
      })}
    </Tag>
  )
}
