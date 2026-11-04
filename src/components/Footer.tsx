import { resume } from '../data/resume'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-fg-muted font-medium">
          <span className="text-violet font-bold">//</span> {resume.name}
        </span>
        <span className="text-xs text-fg-subtle">
          {resume.location} · {year}
        </span>
      </div>
    </footer>
  )
}
