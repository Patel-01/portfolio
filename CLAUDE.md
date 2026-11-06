# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start Vite dev server (localhost:5173)
npm run build      # tsc + vite build → dist/
npm run preview    # preview production build locally
npm run deploy     # build + push to GitHub Pages (gh-pages branch)
```

There are no tests or lint scripts defined.

## Architecture

Single-page React portfolio deployed to GitHub Pages at `/portfolio/` (set in `vite.config.ts` as `base: '/portfolio/'`).

**Data layer:** All content (bio, experience, projects, skills, stats) lives in `src/data/resume.ts` as a single `resume` const object. Edit this file to update any displayed content — no other files need changing for content-only updates.

**Component structure:** `App.tsx` orchestrates the page: a splash `Loader`, then a fixed `Cursor`, `Nav`, and a `<main>` with sections in order: `Hero → Stats → About → WorkspaceBanner → Experience → Projects → Skills → Contact`, plus `Footer`.

**Styling system:** Tailwind CSS with a custom dark-only design token palette defined in both `tailwind.config.ts` (Tailwind classes: `bg`, `bg-2`, `bg-3`, `bg-4`, `violet`, `mint`, `fg`, `fg-muted`, `fg-subtle`) and CSS custom properties in `src/index.css` (`--violet`, `--mint`, `--bg`, `--fg`, etc.). Utility classes `.grad-text`, `.glass-card`, `.section`, `.glow-blob` are defined in `index.css`. Always use Tailwind tokens — avoid hardcoding hex values in components.

**Animations:** Framer Motion throughout. The root `MotionConfig` in `App.tsx` has `reducedMotion="user"`, so all animations respect the OS preference automatically.

**Images/assets:** Public assets are under `public/`. Due to the GitHub Pages base path, reference them as `/portfolio/<filename>` in components and HTML. Exception: logo paths in `resume.ts` are stored as bare relative paths (e.g. `images/logos/operate.png`) and are prefixed with `/portfolio/` at the component render site — keep that convention when adding logos.

**Extended Tailwind tokens:** Beyond the base palette, components use sub-tokens like `violet-label`, `violet-dim`, `violet-border`, `mint-dim`, `mint-border` — all defined in `tailwind.config.ts`. Prefer these over arbitrary opacity modifiers.

**Type-color mapping:** `Projects.tsx` has a local `typeColors` record mapping project `type` strings to hex values. When adding a new type to a project or experience entry in `resume.ts`, add the matching color entry there too.

**Loader:** The splash `Loader` in `App.tsx` is skipped on repeat visits (keyed on `sessionStorage`). To re-test it during dev, clear sessionStorage in DevTools or open a fresh private window.
