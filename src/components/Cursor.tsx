import { useEffect, useRef } from 'react'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    dot.style.opacity = '1'
    ring.style.opacity = '1'

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
    }
    const onDocLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }
    const onDocEnter = () => {
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }

    const onEnterLink = () => ring.classList.add('scaled')
    const onLeaveLink = () => ring.classList.remove('scaled')
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', onEnterLink)
      el.addEventListener('mouseleave', onLeaveLink)
    })

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onDocLeave)
    document.addEventListener('mouseenter', onDocEnter)

    const tick = () => {
      dot.style.transform = `translate(${posRef.current.x - 4}px, ${posRef.current.y - 4}px)`
      ringPos.current.x += (posRef.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (posRef.current.y - ringPos.current.y) * 0.12
      ring.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onDocLeave)
      document.removeEventListener('mouseenter', onDocEnter)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-violet pointer-events-none z-[9999] opacity-0"
        style={{ transition: 'opacity 0.3s' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-violet/40 pointer-events-none z-[9999] opacity-0 ring-cursor"
        style={{ transition: 'opacity 0.3s, width 0.2s, height 0.2s, border-color 0.2s' }}
      />
      <style>{`
        @media (pointer: fine) { body { cursor: none; } }
        .ring-cursor.scaled {
          width: 50px;
          height: 50px;
          border-color: rgba(110,85,255,0.6);
        }
        @media (pointer: coarse) {
          .ring-cursor, [data-cursor-dot] { display: none; }
        }
      `}</style>
    </>
  )
}
