import { useEffect, useRef } from 'react'

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface Props {
  children: string
}

export function RollText({ children }: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (REDUCED) return
    const wrap = wrapRef.current
    if (!wrap) return
    const parent = (wrap.closest('a, button') ?? wrap) as HTMLElement
    const cols = Array.from(wrap.querySelectorAll<HTMLSpanElement>('[data-col]'))

    const enter = () => cols.forEach((c) => { c.style.transform = 'translateY(-1em)' })
    const leave = () => cols.forEach((c) => { c.style.transform = '' })

    parent.addEventListener('mouseenter', enter)
    parent.addEventListener('mouseleave', leave)
    // Also roll on keyboard focus so the effect works without a pointer
    parent.addEventListener('focus', enter)
    parent.addEventListener('blur', leave)
    return () => {
      parent.removeEventListener('mouseenter', enter)
      parent.removeEventListener('mouseleave', leave)
      parent.removeEventListener('focus', enter)
      parent.removeEventListener('blur', leave)
    }
  }, [children])

  if (REDUCED) return <>{children}</>

  const letters = children.split('')

  return (
    <span
      ref={wrapRef}
      style={{ display: 'inline-flex', verticalAlign: 'bottom' }}
    >
      {/* Screen-reader text — sr-only keeps it in the a11y tree */}
      <span className="sr-only">{children}</span>
      {letters.map((letter, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            // Fixed height + lineHeight keeps exactly one row visible
            height: '1em',
            lineHeight: 1,
          }}
        >
          <span
            data-col="1"
            style={{
              display: 'flex',
              flexDirection: 'column',
              lineHeight: 1,
              transition: `transform 0.28s cubic-bezier(0.22,1,0.36,1) ${i * 22}ms`,
            }}
          >
            <span style={{ lineHeight: 1 }}>{letter === ' ' ? ' ' : letter}</span>
            <span style={{ lineHeight: 1 }}>{letter === ' ' ? ' ' : letter}</span>
          </span>
        </span>
      ))}
    </span>
  )
}
