import { Fragment, useLayoutEffect, useRef } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { EASE_OUT_EXPO, paintGradientSlices, srOnly, toLines, useFontsReady, VAR_FONT, type TextLine } from './utils'

type W = { i: number; weight: number }

const word: Variants = {
  hidden: { y: '115%', rotate: 7, fontVariationSettings: "'wght' 150" },
  show: ({ i, weight }: W) => ({
    y: '0%', rotate: 0, fontVariationSettings: `'wght' ${weight}`,
    transition: {
      y: { duration: 0.95, ease: EASE_OUT_EXPO, delay: i * 0.065 },
      rotate: { duration: 0.95, ease: EASE_OUT_EXPO, delay: i * 0.065 },
      fontVariationSettings: { duration: 1.3, ease: EASE_OUT_EXPO, delay: i * 0.065 + 0.15 },
    },
  }),
}

type Props = {
  /** New API: one or more lines (string shorthand or TextLine[] for gradient/class per line). */
  lines?: string | TextLine[]
  /** Legacy API: same as lines={children}. Used when RevealHeading wraps text as a child. */
  children?: string
  className?: string
  as?: 'h2' | 'h3' | 'p'
  weight?: number
  /** Legacy: overrides the sr-only label (useful when visual text is split across two tags). */
  srText?: string
  /** Legacy: marks the whole text as a gradient (shorthand for TextLine.gradient on a single line). */
  gradient?: boolean
  /** Legacy: extra inline styles on the root element. */
  style?: React.CSSProperties
}

export function RevealHeading({ lines, children, className, as = 'h2', weight = 700, srText, gradient, style: styleProp }: Props) {
  const reduce = useReducedMotion()
  const fontsReady = useFontsReady()

  // Resolve to TextLine[] — prefer new `lines` prop, fall back to legacy `children`+`gradient`
  const list = lines !== undefined ? toLines(lines) : [{ text: children ?? '', gradient }]
  const srLabel = srText ?? list.map((l) => l.text).join(' ')

  const refs = useRef<(HTMLSpanElement | null)[]>([])
  const Tag = as === 'h3' ? motion.h3 : as === 'p' ? motion.p : motion.h2
  const gradEls = () => refs.current.filter((el, i): el is HTMLSpanElement => !!el && !!list[i]?.gradient)

  useLayoutEffect(() => {
    if (reduce || !fontsReady) return
    const els = gradEls()
    if (!els.length) return
    const paint = () => els.forEach(paintGradientSlices)
    paint()
    const ro = new ResizeObserver(paint)
    els.forEach((el) => ro.observe(el))
    return () => ro.disconnect()
  }, [reduce, fontsReady]) // eslint-disable-line react-hooks/exhaustive-deps

  const followGradient = () => {
    const els = gradEls()
    if (!els.length) return
    const end = performance.now() + 2200
    const loop = () => { els.forEach(paintGradientSlices); if (performance.now() < end) requestAnimationFrame(loop) }
    requestAnimationFrame(loop)
  }

  if (reduce) {
    return (
      <Tag className={className} style={styleProp}>
        <span style={srOnly}>{srLabel}</span>
        <span aria-hidden>
          {list.map((l, i) => (
            <Fragment key={i}>
              {i > 0 && <br />}
              <span className={l.className}>{l.text}</span>
            </Fragment>
          ))}
        </span>
      </Tag>
    )
  }

  let index = 0
  return (
    <Tag
      className={className}
      style={{ fontFamily: VAR_FONT, ...styleProp }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-12% 0px' }}
      onViewportEnter={followGradient}
    >
      <span style={srOnly}>{srLabel}</span>
      {list.map((l, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          <span
            aria-hidden
            ref={(el) => { refs.current[li] = el }}
            className={l.className}
            style={{ position: 'relative', display: 'inline' }}
          >
            {l.text.split(' ').map((w, wi, ws) => {
              const i = index++
              return (
                <Fragment key={wi}>
                  <span
                    style={{
                      display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom',
                      paddingBottom: '0.12em', marginBottom: '-0.12em',
                    }}
                  >
                    <motion.span
                      data-glyph
                      variants={word}
                      custom={{ i, weight }}
                      style={{ display: 'inline-block', originX: 0, originY: 1 }}
                    >
                      {w}
                    </motion.span>
                  </span>
                  {wi < ws.length - 1 && ' '}
                </Fragment>
              )
            })}
          </span>
        </Fragment>
      ))}
    </Tag>
  )
}
