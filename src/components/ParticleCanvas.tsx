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

    // Throttle to ~30fps on mobile/touch, 60fps on desktop
    const isMobile = window.matchMedia('(pointer: coarse)').matches
    const frameInterval = isMobile ? 1000 / 30 : 0
    let lastTime = 0
    let isVisible = true

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

    const draw = (now: number) => {
      if (!isVisible || document.hidden) return
      if (frameInterval > 0 && now - lastTime < frameInterval) {
        animId = requestAnimationFrame(draw)
        return
      }
      lastTime = now

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

    const startLoop = () => { animId = requestAnimationFrame(draw) }
    const stopLoop = () => cancelAnimationFrame(animId)

    // Pause when canvas scrolls off-screen
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          isVisible = true
          startLoop()
        } else if (!entry.isIntersecting && isVisible) {
          isVisible = false
          stopLoop()
        }
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    // Pause when tab is hidden
    const onVisibilityChange = () => {
      if (document.hidden) {
        stopLoop()
      } else if (isVisible) {
        startLoop()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    init()
    startLoop()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      stopLoop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  )
}
