import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Mail, Github, Linkedin, Globe, Phone, ArrowRight } from 'lucide-react'
import { resume } from '../data/resume'

const links = [
  { icon: Mail, label: 'Email', value: resume.email, href: `mailto:${resume.email}` },
  { icon: Linkedin, label: 'LinkedIn', value: 'pankaj-kumar-verma-428a8a202', href: resume.linkedin },
  { icon: Github, label: 'GitHub', value: 'Patel-world', href: resume.github },
  { icon: Globe, label: 'Portfolio', value: 'patel-world.github.io', href: resume.portfolio },
  { icon: Phone, label: 'Phone', value: resume.phone, href: `tel:${resume.phone}` },
]

export function Contact() {
  const imgRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ['start end', 'end start'],
  })
  // Slow upward drift as background while scrolling through section
  const imgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <section id="contact" className="relative overflow-hidden">
      {/* Outdoor photo — subtle parallax background */}
      <div ref={imgRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: imgY }}>
          <img
            src={`${import.meta.env.BASE_URL}images/outdoor.png`}
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 30%' }}
            loading="lazy"
          />
        </motion.div>
        {/* Layered overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, #0A0A0F 0%, rgba(10,10,15,0.65) 35%, rgba(10,10,15,0.65) 65%, #0A0A0F 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative section">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <span className="text-violet text-sm font-semibold mb-3 block">Contact</span>
            <h2 className="text-5xl font-black text-fg leading-tight mb-4">
              Let's build<br />
              <span className="grad-text">something great.</span>
            </h2>
            <p className="text-fg-muted max-w-md mx-auto leading-relaxed">
              Open to full-time roles, freelance, and interesting engineering collaborations.
            </p>
          </motion.div>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center mb-12"
          >
            <a
              href={`mailto:${resume.email}`}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-violet text-white font-bold text-base
                hover:bg-violet/90 shadow-xl shadow-violet/25 hover:shadow-violet/40
                hover:-translate-y-0.5 transition-all duration-200"
            >
              <Mail size={18} />
              Say hello
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>

          {/* Links grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto"
          >
            {links.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="glass-card p-4 flex items-center gap-3 hover:border-violet/25 hover:bg-violet/5 transition-all duration-200 group"
                style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
              >
                <div className="p-2 rounded-lg bg-violet/10 text-violet group-hover:bg-violet/15 transition-colors flex-shrink-0">
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-fg-muted font-medium">{label}</div>
                  <div className="text-sm text-fg font-medium truncate">{value}</div>
                </div>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
