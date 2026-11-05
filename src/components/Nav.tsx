import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Linkedin, Menu, X, FileText } from 'lucide-react'
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
  const [activeSection, setActiveSection] = useState<string>('')

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

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-20% 0% -60% 0%', threshold: 0 }
    )
    sections.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -80 : 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#top" className="font-bold text-fg text-sm tracking-tight hover:text-violet transition-colors py-3 -my-3">
          <span className="text-violet">//</span> PKV
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => {
            const isActive = activeSection === l.href.slice(1)
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? 'true' : undefined}
                className={`text-sm font-medium transition-colors py-2 relative ${
                  isActive ? 'text-fg' : 'text-fg-muted hover:text-fg'
                }`}
              >
                {l.label}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-violet rounded-full" />
                )}
              </a>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={resume.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-muted hover:text-fg transition-colors p-2"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href={resume.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-muted hover:text-fg transition-colors p-2"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          {resume.resumeUrl && (
            <a
              href={resume.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-fg-muted text-sm font-medium hover:border-violet/40 hover:text-fg transition-colors"
            >
              <FileText size={14} />
              Résumé
            </a>
          )}
          <a
            href={`mailto:${resume.email}`}
            className="px-4 py-2 rounded-lg bg-violet text-white text-sm font-semibold hover:bg-violet/90 transition-colors"
          >
            Hire me
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-fg-muted hover:text-fg transition-colors p-2.5 -mr-2.5"
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
            className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-1"
            style={{ background: '#0A0A0F' }}
          >
            {links.map(l => {
              const isActive = activeSection === l.href.slice(1)
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`text-sm font-medium transition-colors flex items-center min-h-[44px] ${
                    isActive ? 'text-fg' : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  {l.label}
                </a>
              )
            })}
            <div className="flex gap-3 pt-3 mt-1 border-t border-border items-center">
              <a
                href={resume.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-muted hover:text-fg transition-colors p-2 -ml-2"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href={resume.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-muted hover:text-fg transition-colors p-2"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              {resume.resumeUrl && (
                <a
                  href={resume.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-fg-muted text-xs font-medium"
                >
                  <FileText size={13} />
                  Résumé
                </a>
              )}
              <a
                href={`mailto:${resume.email}`}
                className="ml-auto px-4 py-2 rounded-lg bg-violet text-white text-sm font-semibold min-h-[44px] flex items-center"
              >
                Hire me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
