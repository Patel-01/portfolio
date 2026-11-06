import { resume } from '../data/resume'
import { FooterWordmark } from './cinematic'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer>
      {/* Large kinetic wordmark — no horizontal padding so 24vw fits at all viewport widths */}
      <div className="overflow-hidden pt-16 pb-2">
        <FooterWordmark text="PANKAJ" />
      </div>
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm text-fg-muted font-medium">
            <span className="text-violet font-bold">//</span> {resume.name}
          </span>
          <span className="text-xs text-fg-muted">
            {resume.location} · {year}
          </span>
        </div>
      </div>
    </footer>
  )
}
