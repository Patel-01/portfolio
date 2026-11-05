import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function WorkspaceBanner() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  // Subtle Ken Burns: image drifts slightly as you scroll
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1])
  const imgX = useTransform(scrollYProgress, [0, 1], ['0%', '-1.5%'])

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ height: '420px' }}>
      {/* Image */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: imgScale, x: imgX }}
      >
        <img
          src={`${import.meta.env.BASE_URL}images/workspace.png`}
          alt="Developer workspace"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 25%' }}
          loading="lazy"
        />
      </motion.div>

      {/* Gradient overlay — dark left, transparent right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.75) 40%, rgba(10,10,15,0.3) 70%, rgba(10,10,15,0.1) 100%)',
        }}
      />
      {/* Top + bottom fade */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #0A0A0F, transparent)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0A0A0F, transparent)' }}
      />

      {/* Text content */}
      <div className="relative h-full max-w-6xl mx-auto px-6 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md"
        >
          <p className="text-fg-muted text-sm font-medium mb-2">Engineer at work</p>
          <h3 className="text-3xl sm:text-4xl font-black text-fg leading-tight mb-4">
            Where code<br />
            <span className="grad-text">meets craft.</span>
          </h3>
          <p className="text-fg-muted text-sm leading-relaxed">
            Full-stack engineer in Bengaluru — building products since 2019,
            shipping across AI platforms, mobile marketplaces, and cloud systems.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
