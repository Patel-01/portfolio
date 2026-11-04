import { motion } from 'framer-motion'
import { MapPin, Code2, Cpu, Zap } from 'lucide-react'
import { resume } from '../data/resume'

const traits = [
  {
    icon: Code2,
    title: 'Product-minded engineer',
    body: "I build for outcomes, not tickets. Whether it's a solo marketplace from scratch or a 6-contribution AI platform, I keep the user in mind.",
  },
  {
    icon: Cpu,
    title: 'Full-stack depth',
    body: 'React Native to Python workers to CI/CD pipelines. I work across the whole system without handoff delays.',
  },
  {
    icon: Zap,
    title: 'High throughput',
    body: '488 merged PRs. 573 reviews. I move fast and review carefully — because shipping slowly and reviewing never are both expensive.',
  },
]

export function About() {
  return (
    <section id="about" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_380px] gap-14 items-start">
          {/* Left: text + traits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-violet text-sm font-semibold mb-3 block">About</span>
            <h2 className="text-4xl font-bold text-fg mb-5 leading-tight">
              Building software that ships and scales.
            </h2>
            <p className="text-fg-muted leading-relaxed mb-4">
              {resume.bio}
            </p>
            <div className="flex items-center gap-2 text-sm text-fg-muted mb-10">
              <MapPin size={14} className="text-violet flex-shrink-0" />
              {resume.location}
            </div>

            {/* Trait cards */}
            <div className="flex flex-col gap-3">
              {traits.map((t, i) => (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-card p-4 hover:border-violet/20 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-violet/10 text-violet group-hover:bg-violet/15 transition-colors flex-shrink-0 mt-0.5">
                      <t.icon size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-fg text-sm mb-0.5">{t.title}</h3>
                      <p className="text-fg-muted text-sm leading-relaxed">{t.body}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: workspace-alt photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block relative"
          >
            {/* Glow behind */}
            <div
              className="absolute -inset-6 rounded-3xl"
              style={{
                background: 'radial-gradient(ellipse, rgba(66,245,200,0.07) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 24px 60px rgba(0,0,0,0.4)',
              }}
            >
              <img
                src="/images/workspace-alt.png"
                alt="Pankaj at his workspace"
                className="w-full object-cover"
                style={{ aspectRatio: '16/10', objectPosition: 'center 20%' }}
                loading="lazy"
              />
              {/* Dark vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(10,10,15,0.4) 0%, transparent 60%)',
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
