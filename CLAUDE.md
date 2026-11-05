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

**Images/assets:** Public assets are under `public/`. Due to the GitHub Pages base path, reference them as `/portfolio/<filename>` in production or use Vite's `import` for processed assets.
