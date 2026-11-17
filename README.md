# anthonythomas.dev

Anthony Thomas's portfolio: a home page with a particle-name hero, plus a case study page for each project.

**Live:** https://anthonythomas.dev

Built with [Astro](https://astro.build), one React island (the hero), Tailwind CSS v4 and TypeScript. Deployed on Vercel. Why Astro: [docs/adr/0001-astro-over-nextjs.md](docs/adr/0001-astro-over-nextjs.md). Vocabulary: [GLOSSARY.md](GLOSSARY.md).

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:4321 |
| `npm run check` | Type-check everything, then run a production build |
| `npm run preview` | Serve the production build locally (run a build first) |

Needs Node 22.12 or newer. Astro 6 is used because Astro 7 requires Node 22.23+.

## Where things live

| To change… | Edit… |
|---|---|
| Name, tagline, status, email, links, About, Education | `src/data/site.ts` |
| Colours | the `@theme` block in `src/styles/global.css` (every colour is defined there) |
| A project's card or its case study | `src/content/projects/<slug>.md` (frontmatter = the card, body = the case study) |
| The résumé | replace `public/Anthony_Thomas_Resume.pdf` |

### Add a project

1. Copy `src/content/projects/neetcode-tracker.md` to a new file and edit the frontmatter and body.
2. Optional: put a screenshot in `src/assets/projects/` and point `cover` (and `gallery`) at it. Images are resized and converted to WebP at build time.
3. `order` decides where it appears. A project with no `cover` shows a "Demo video coming soon" tile.

The page, the home-page row and the "next project" link are generated automatically.

## Notes

- **Hero:** `src/components/ParticleName.tsx`. It respects `prefers-reduced-motion` (static dots), pauses when off-screen, and the plain-text `<h1>` stays in the page for screen readers and no-JS visitors.
- **Accent colour:** `--color-accent` (decorative) and `--color-accent-strong` (text and buttons) are the same hue; the second is darkened to pass WCAG AA contrast.
- Out-of-scope ideas are parked in [docs/future-ideas.md](docs/future-ideas.md).
