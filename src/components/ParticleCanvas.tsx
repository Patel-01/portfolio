import { useEffect, useRef } from 'react'

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0, h = 0, animId = 0
    const VIOLET = '110,85,255'
    const MINT = '66,245,200'

    type P = { x: number; y: number; vx: number; vy: number; r: number; c: string }
    let particles: P[] = []

    const resize = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }
    const init = () => {
      resize()
      particles = Array.from({ length: 55 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.4 + 0.5,
        c: Math.random() > 0.5 ? VIOLET : MINT,
      }))
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.c},0.55)`
        ctx.fill()
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 110) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${particles[i].c},${(1 - d / 110) * 0.14})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    init(); draw()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  )
}
