import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { resume } from '../data/resume'

const traits = [
  {
    num: '01',
    title: 'Product-minded engineer',
    body: "I build for outcomes, not tickets. Whether it's a solo marketplace from scratch or a 6-contribution AI platform, I keep the user in mind.",
  },
  {
    num: '02',
    title: 'Full-stack depth',
    body: 'React Native to Python workers to CI/CD pipelines. I work across the whole system without handoff delays.',
  },
  {
    num: '03',
    title: 'High throughput',
    body: '488 merged PRs. 573 reviews. I move fast and review carefully — because shipping slowly and reviewing never are both expensive.',
  },
]

export function About() {
  return (
    <section id="about" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: text + traits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-violet text-sm font-semibold mb-3 block tracking-wide">About</span>
            <h2 className="text-4xl font-bold text-fg mb-5 leading-tight">
              Building software that ships and scales.
            </h2>
            <p className="text-fg-muted leading-relaxed mb-3">
              {resume.bio}
            </p>
            <div className="flex items-center gap-2 text-sm text-fg-muted mb-12">
              <MapPin size={14} className="text-violet flex-shrink-0" />
              {resume.location}
            </div>

            {/* Editorial trait list */}
            <div className="flex flex-col divide-y divide-border">
              {traits.map((t, i) => (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="py-5 group flex gap-5 items-start"
                >
                  <span className="text-violet text-xs font-mono mt-0.5 w-6 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                    {t.num}
                  </span>
                  <div>
                    <h3 className="font-semibold text-fg text-sm mb-1.5 group-hover:text-violet transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-fg-muted text-sm leading-relaxed">{t.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: portrait photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block sticky top-28"
          >
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 32px 80px rgba(0,0,0,0.5)',
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}images/portrait.png`}
                alt="Pankaj Kumar Verma"
                className="w-full object-cover"
                style={{ aspectRatio: '4/5', objectPosition: 'center top' }}
                loading="lazy"
              />
              {/* Subtle bottom fade */}
              <div
                className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(10,10,15,0.55) 0%, transparent 100%)',
                }}
              />
              {/* Caption */}
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                <span className="text-white/60 text-xs font-mono">Bengaluru, 2026</span>
                <span className="text-white/40 text-xs font-mono">@patel-world</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
