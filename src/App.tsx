import { useEffect, useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Stats } from './components/Stats'
import { About } from './components/About'
import { WorkspaceBanner } from './components/WorkspaceBanner'
import { Experience } from './components/Experience'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { Testimonials } from './components/Testimonials'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { VelocityMarquee } from './components/cinematic'

function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    try { sessionStorage.setItem('loader-shown', '1') } catch {}
    const t = setTimeout(onDone, 300)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: '#06060A' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="flex flex-col items-center gap-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-5xl font-black tracking-tight">
            <span className="text-violet">//</span>
            <span className="text-fg"> PKV</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-28 h-px rounded-full overflow-hidden bg-fg-subtle/30"
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #6E55FF, #42F5C8)' }}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.25, delay: 0.1, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(() => {
    try { return !!sessionStorage.getItem('loader-shown') } catch { return false }
  })

  return (
    <MotionConfig reducedMotion="user">
    <>
      {/* Skip to main content */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Film grain overlay — z below header */}
      <div
        className="pointer-events-none fixed inset-0 z-[20]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
          opacity: 0.027,
          mixBlendMode: 'overlay',
        }}
        aria-hidden
      />

      <AnimatePresence>{!loaded && <Loader onDone={() => setLoaded(true)} />}</AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <Nav />
        <main id="main-content">
          <Hero />
          <Stats />
          <VelocityMarquee />
          <About />
          <WorkspaceBanner />
          <Experience />
          <Projects />
          <Testimonials />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </motion.div>
    </>
    </MotionConfig>
  )
}
