import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Linkedin, Menu, X } from 'lucide-react'
import { resume } from '../data/resume'

const links = [
  { label: 'Work', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lastY, setLastY] = useState(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      setHidden(y > lastY && y > 100)
      setLastY(y)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastY])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -80 : 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/80 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="font-bold text-fg text-sm tracking-tight hover:text-violet transition-colors">
          <span className="text-violet">//</span> PKV
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-fg-muted text-sm font-medium hover:text-fg transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={resume.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-muted hover:text-fg transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href={resume.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-muted hover:text-fg transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href={`mailto:${resume.email}`}
            className="px-4 py-2 rounded-lg bg-violet text-white text-sm font-semibold hover:bg-violet/90 transition-colors"
          >
            Hire me
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-fg-muted hover:text-fg transition-colors p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-bg-2/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-4"
          >
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-fg-muted text-sm font-medium hover:text-fg transition-colors py-1"
              >
                {l.label}
              </a>
            ))}
            <div className="flex gap-4 pt-2 border-t border-border">
              <a href={resume.github} target="_blank" rel="noopener noreferrer" className="text-fg-muted hover:text-fg transition-colors">
                <Github size={18} />
              </a>
              <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="text-fg-muted hover:text-fg transition-colors">
                <Linkedin size={18} />
              </a>
              <a href={`mailto:${resume.email}`} className="ml-auto px-4 py-1.5 rounded-lg bg-violet text-white text-sm font-semibold">
                Hire me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
