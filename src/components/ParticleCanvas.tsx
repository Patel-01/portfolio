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

    const isMobile = window.matchMedia('(pointer: coarse)').matches
    const frameInterval = isMobile ? 1000 / 30 : 0
    let lastTime = 0
    let isVisible = true

    let shineReady = false
    let lastShineCheck = 0

    type P = {
      x: number; y: number
      vx: number; vy: number
      r: number; c: string
      shineT: number      // -1 = idle, 0..1 = blast cycle progress
      shineStart: number
      shineDur: number
    }
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
        shineT: -1,
        shineStart: 0,
        shineDur: 1800 + Math.random() * 1400,
      }))
    }

    const draw = (now: number) => {
      if (!isVisible || document.hidden) return
      if (frameInterval > 0 && now - lastTime < frameInterval) {
        animId = requestAnimationFrame(draw)
        return
      }
      lastTime = now

      if (!shineReady && now > 900) shineReady = true

      ctx.clearRect(0, 0, w, h)

      // ── Update positions + blast cycle ─────────────────────────────────
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        if (p.shineT >= 0) {
          p.shineT = Math.min(1, (now - p.shineStart) / p.shineDur)
          if (p.shineT >= 1) {
            p.x = Math.random() * w
            p.y = Math.random() * h
            p.vx = (Math.random() - 0.5) * 0.28
            p.vy = (Math.random() - 0.5) * 0.28
            p.shineDur = 1800 + Math.random() * 1400
            p.shineT = -1
          }
        }
      })

      // ── Base particles ──────────────────────────────────────────────────
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.c},0.4)`
        ctx.fill()
      })

      // ── Connection lines ────────────────────────────────────────────────
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

      // ── Blast overlays ──────────────────────────────────────────────────
      particles.forEach(p => {
        if (p.shineT < 0) return
        const t = p.shineT

        // Alpha: instant burst → hold → quick opacity cut
        let alpha: number
        if (t < 0.06) {
          alpha = 1 - Math.pow(1 - t / 0.06, 3)   // snap to bright
        } else if (t < 0.78) {
          alpha = 1                                  // hold full brightness
        } else if (t < 0.90) {
          alpha = 1 - (t - 0.78) / 0.12            // linear cut over ~12% of cycle
        } else {
          alpha = 0
        }
        alpha = Math.max(0, alpha)
        if (alpha < 0.01) return

        const baseR = Math.max(1.5, p.r)
        // Radius stays constant — only opacity changes
        const coreR  = baseR * 3

        // ── Expanding shockwave ring ────────────────────────────────────
        if (t < 0.35) {
          const ringT    = t / 0.35
          const ringR    = baseR * (4 + ringT * 28)
          const ringA    = (1 - ringT) * alpha * 0.65
          if (ringA > 0.01) {
            ctx.beginPath()
            ctx.arc(p.x, p.y, ringR, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(${p.c},${ringA.toFixed(3)})`
            ctx.lineWidth   = Math.max(0.4, 2.5 * (1 - ringT * 0.9))
            ctx.stroke()
          }
        }

        // ── Star / cross flare ──────────────────────────────────────────
        if (t < 0.28) {
          const flareT   = t / 0.28
          const flareA   = alpha * (1 - flareT) * 0.5
          const flareLen = baseR * (10 + (1 - flareT) * 18)
          if (flareA > 0.01) {
            ctx.save()
            ctx.lineCap = 'round'

            // Main cross (H + V)
            ctx.strokeStyle = `rgba(${p.c},${flareA.toFixed(3)})`
            ctx.lineWidth   = 1.3
            ctx.beginPath(); ctx.moveTo(p.x - flareLen, p.y); ctx.lineTo(p.x + flareLen, p.y); ctx.stroke()
            ctx.beginPath(); ctx.moveTo(p.x, p.y - flareLen); ctx.lineTo(p.x, p.y + flareLen); ctx.stroke()

            // Diagonal arms (shorter + dimmer)
            const diagLen = flareLen * 0.52
            ctx.strokeStyle = `rgba(${p.c},${(flareA * 0.55).toFixed(3)})`
            ctx.lineWidth   = 0.8
            ctx.beginPath(); ctx.moveTo(p.x - diagLen, p.y - diagLen); ctx.lineTo(p.x + diagLen, p.y + diagLen); ctx.stroke()
            ctx.beginPath(); ctx.moveTo(p.x + diagLen, p.y - diagLen); ctx.lineTo(p.x - diagLen, p.y + diagLen); ctx.stroke()

            ctx.restore()
          }
        }

        // ── Radial glow halo — fixed size, only opacity fades ───────────
        const glowR = baseR * 16
        const grad  = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR)
        grad.addColorStop(0,    `rgba(${p.c},${Math.min(1, alpha).toFixed(3)})`)
        grad.addColorStop(0.12, `rgba(${p.c},${(alpha * 0.7).toFixed(3)})`)
        grad.addColorStop(0.45, `rgba(${p.c},${(alpha * 0.22).toFixed(3)})`)
        grad.addColorStop(1,    `rgba(${p.c},0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // ── Bright core ─────────────────────────────────────────────────
        ctx.beginPath()
        ctx.arc(p.x, p.y, coreR, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.c},${Math.min(1, alpha * 0.95 + 0.05).toFixed(3)})`
        ctx.fill()
      })

      // ── Manage blast count (keep 3, occasionally 4) ─────────────────────
      if (shineReady && now - lastShineCheck > 300) {
        lastShineCheck = now
        const active = particles.filter(p => p.shineT >= 0).length
        const idle   = particles.filter(p => p.shineT < 0)

        const shouldAdd =
          (active < 3 && idle.length > 0) ||
          (active === 3 && idle.length > 0 && Math.random() < 0.1)

        if (shouldAdd) {
          const p = idle[Math.floor(Math.random() * idle.length)]
          p.shineT    = 0
          p.shineStart = now
        }
      }

      animId = requestAnimationFrame(draw)
    }

    const startLoop = () => { animId = requestAnimationFrame(draw) }
    const stopLoop  = () => cancelAnimationFrame(animId)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) { isVisible = true;  startLoop() }
        else if (!entry.isIntersecting && isVisible) { isVisible = false; stopLoop() }
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    const onVisibilityChange = () => {
      if (document.hidden) stopLoop()
      else if (isVisible) startLoop()
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
