import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import { ArrowDown, Github, Linkedin, FileText } from 'lucide-react'
import { resume } from '../data/resume'
import { ParticleCanvas } from './ParticleCanvas'
import { KineticHeadline } from './cinematic'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.65], [0, -50])

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springX = useSpring(rawX, { damping: 28, stiffness: 140 })
  const springY = useSpring(rawY, { damping: 28, stiffness: 140 })
  const portraitX = useTransform(springX, [-0.5, 0.5], [14, -14])
  const portraitY = useTransform(springY, [-0.5, 0.5], [8, -8])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-x-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 -left-32 w-[560px] h-[560px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(110,85,255,0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute -bottom-20 right-1/4 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(66,245,200,0.07) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <ParticleCanvas />

      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Main content */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative w-full max-w-6xl mx-auto px-6 pt-24 pb-16"
      >
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-center">
          {/* LEFT: Text */}
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-violet/30 bg-violet/10 text-violet">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-mint flex-shrink-0"
                  style={{ animation: 'pulse 2.2s ease infinite' }}
                />
                Open to new roles
              </span>
            </motion.div>

            {/* Mobile-only avatar */}
            <motion.div variants={fadeUp} className="lg:hidden mb-6">
              <img
                src={`${import.meta.env.BASE_URL}images/portrait.png`}
                alt="Pankaj Kumar Verma"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover object-top border-2 border-violet/30"
                loading="eager"
              />
            </motion.div>

            <motion.div variants={fadeUp} className="mb-2">
              <span className="text-fg-muted text-xl sm:text-2xl font-semibold tracking-tight">
                Pankaj Kumar Verma
              </span>
            </motion.div>

            <motion.div variants={fadeUp} className="mb-6">
              <KineticHeadline
                as="h1"
                lines={[
                  { text: 'I build AI &', gradient: true },
                  { text: 'mobile products.', gradient: false },
                ]}
                className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none"
              />
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-base text-fg-muted leading-relaxed max-w-lg mb-8"
            >
              {resume.bio}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet text-white font-semibold text-sm
                  shadow-lg shadow-violet/25 hover:shadow-violet/40 hover:-translate-y-0.5
                  transition-all duration-200 min-h-[44px]"
              >
                View my work
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href={`mailto:${resume.email}`}
                className="inline-flex items-center px-6 py-3 rounded-xl border border-border text-fg-muted font-semibold text-sm
                  hover:border-violet/40 hover:text-fg hover:bg-violet/5 transition-all duration-200 min-h-[44px]"
              >
                Get in touch
              </a>
              {resume.resumeUrl && (
                <a
                  href={resume.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-fg-muted font-semibold text-sm
                    hover:border-violet/40 hover:text-fg hover:bg-violet/5 transition-all duration-200 min-h-[44px]"
                >
                  <FileText size={15} />
                  Résumé
                </a>
              )}
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-1">
              <a
                href={resume.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-fg-muted text-sm hover:text-fg transition-colors px-2 py-2.5 -ml-2"
                aria-label="GitHub"
              >
                <Github size={15} />
                <span>Patel-world</span>
              </a>
              <span className="w-px h-3.5 bg-border mx-1" />
              <a
                href={resume.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-fg-muted text-sm hover:text-fg transition-colors px-2 py-2.5"
                aria-label="LinkedIn"
              >
                <Linkedin size={15} />
                <span>LinkedIn</span>
              </a>
              <span className="hidden sm:inline w-px h-3.5 bg-border mx-1" />
              <span className="hidden sm:inline text-fg-muted text-sm px-2">{resume.location}</span>
            </motion.div>
          </motion.div>

          {/* RIGHT: Portrait (desktop only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex justify-center"
          >
            <motion.div style={{ x: portraitX, y: portraitY }} className="relative">
              <div
                className="absolute -inset-8 rounded-3xl"
                style={{
                  background: 'radial-gradient(ellipse, rgba(110,85,255,0.18) 0%, transparent 70%)',
                  filter: 'blur(32px)',
                }}
              />
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  width: '360px',
                  aspectRatio: '3/4',
                  boxShadow: '0 0 0 1px rgba(110,85,255,0.2), 0 32px 80px rgba(0,0,0,0.5)',
                }}
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/portrait.png`}
                  alt="Pankaj Kumar Verma"
                  width={360}
                  height={480}
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to left, rgba(110,85,255,0.07) 0%, transparent 40%)',
                  }}
                />
                <div
                  className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, rgba(10,10,15,0.5) 0%, transparent 100%)',
                  }}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-5 -left-10 glass-card px-5 py-3"
                style={{ backdropFilter: 'blur(20px)' }}
              >
                <div className="text-2xl font-black grad-text leading-none">342</div>
                <div className="text-xs text-fg-muted mt-0.5">PRs — Recco alone</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator — positioned relative to section (min-h-screen), hidden at short heights */}
      <motion.a
        href="#stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="[@media(max-height:700px)]:hidden hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-fg-muted hover:text-fg transition-colors p-2"
        aria-label="Scroll down"
      >
        <span className="text-xs font-medium tracking-wide">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={13} />
        </motion.div>
      </motion.a>
    </section>
  )
}
