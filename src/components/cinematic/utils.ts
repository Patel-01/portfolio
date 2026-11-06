import { useEffect, useState, type CSSProperties } from 'react'

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

/** Variable Inter (from @fontsource-variable/inter) so weight can glide, not step. */
export const VAR_FONT = "'Inter Variable', Inter, system-ui, sans-serif"

export const BRAND_GRADIENT = 'linear-gradient(135deg, rgb(110, 85, 255), rgb(66, 245, 200))'

export type TextLine = {
  text: string
  className?: string
  /** Line uses a background-clip:text gradient (e.g. `grad-text`). */
  gradient?: boolean
  /** Shrink-wrap the line to its text (for gradients that were on an inline span). */
  inline?: boolean
}

export const srOnly: CSSProperties = {
  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
  overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
}

export function toLines(lines: string | TextLine[]): TextLine[] {
  return typeof lines === 'string' ? [{ text: lines }] : lines
}

/** Waits for web fonts so letters are measured and animated in their final shape. */
export function useFontsReady() {
  const [ready, setReady] = useState(
    () => typeof document === 'undefined' || !document.fonts || document.fonts.status === 'loaded',
  )
  useEffect(() => {
    if (ready) return
    let alive = true
    document.fonts.ready.then(() => alive && setReady(true))
    return () => { alive = false }
  }, [ready])
  return ready
}

/**
 * background-clip:text stops painting once the children are transformed inline-blocks.
 * Fix: give every [data-glyph] child its own slice of the line's gradient, so the
 * line looks like one continuous gradient while each piece moves independently.
 * The line element must be position:relative (it becomes the glyphs' offsetParent).
 */
export function paintGradientSlices(line: HTMLElement) {
  const bg = getComputedStyle(line).backgroundImage
  if (!bg || bg === 'none') return
  const w = line.offsetWidth
  const h = line.offsetHeight
  line.querySelectorAll<HTMLElement>('[data-glyph]').forEach((el) => {
    Object.assign(el.style, {
      backgroundImage: bg,
      backgroundSize: `${w}px ${h}px`,
      backgroundPosition: `${-el.offsetLeft}px ${-el.offsetTop}px`,
      backgroundRepeat: 'no-repeat',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      color: 'transparent',
    } as CSSProperties)
  })
}
