import { motion } from 'framer-motion'
import { resume } from '../data/resume'

const traits = [
  {
    num: '01',
    title: 'Product-minded engineer',
    body: "I build for outcomes, not tickets. Whether it's a full marketplace from scratch or an AI incident-investigation platform, I keep the user in mind.",
  },
  {
    num: '02',
    title: 'Full-stack depth',
    body: 'React Native to Python workers to CI/CD pipelines. I work across the whole system without handoff delays.',
  },
  {
    num: '03',
    title: 'High throughput',
    body: 'I move fast without cutting corners — reviewing code carefully and shipping daily. Throughput matters, so does quality.',
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
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-violet text-sm font-semibold mb-3 block tracking-wide">About</span>
            <h2 className="text-4xl font-bold text-fg mb-5 leading-tight">
              Building software that ships and scales.
            </h2>
            <p className="text-fg-muted leading-relaxed mb-12">
              {resume.aboutBio}
            </p>

            {/* Editorial trait list */}
            <div className="flex flex-col divide-y divide-border">
              {traits.map((t, i) => (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{ duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
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

          {/* Right: workspace photo (not portrait — portrait is used in hero) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block sticky top-28"
          >
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 32px 80px rgba(0,0,0,0.5)',
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}images/workspace.png`}
                alt="Pankaj's workspace"
                className="w-full object-cover"
                style={{ aspectRatio: '4/3', objectPosition: 'center top' }}
                loading="lazy"
              />
              <div
                className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(10,10,15,0.6) 0%, transparent 100%)',
                }}
              />
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
