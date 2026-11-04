import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cursor } from './components/Cursor'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Stats } from './components/Stats'
import { About } from './components/About'
import { WorkspaceBanner } from './components/WorkspaceBanner'
import { Experience } from './components/Experience'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: '#06060A' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Monogram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-5xl font-black tracking-tight">
            <span className="text-violet">//</span>
            <span className="text-fg"> PKV</span>
          </span>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-28 h-px rounded-full overflow-hidden bg-fg-subtle/30"
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #6E55FF, #42F5C8)' }}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-fg-muted text-xs tracking-widest"
        >
          PORTFOLIO 2027
        </motion.p>
      </div>
    </motion.div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {/* Film grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[500]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
          opacity: 0.027,
          mixBlendMode: 'overlay',
        }}
        aria-hidden
      />

      <Cursor />
      <AnimatePresence>{!loaded && <Loader onDone={() => setLoaded(true)} />}</AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Nav />
        <main>
          <Hero />
          <Stats />
          <About />
          <WorkspaceBanner />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </motion.div>
    </>
  )
}
