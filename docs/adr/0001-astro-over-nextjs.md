# Astro over Next.js for the portfolio

The portfolio is a mostly static content site: a home page plus one Case Study page per Project. We chose Astro with React islands and Tailwind over Next.js. Astro ships almost no JavaScript by default, its content collections make each Case Study a Markdown file, and its View Transitions handle page-to-page motion. The only heavy interactive piece, the particle-name hero, loads as a single island on the home page. Next.js was the familiar option (NeetCode Tracker uses it) and scored about the same in our weighted comparison. We picked Astro because it fits a content site better and because learning something new was an explicit goal.

## Considered Options

- **Next.js (App Router)**: familiar, has the biggest ecosystem of animated components, but is more framework than a static site needs, and every animated piece has to opt into client rendering.
- **Vite + React SPA**: the old setup. Rejected because client-only rendering gives Case Study links blank previews when shared.
- **SvelteKit**, **plain HTML + GSAP**: rejected for AI-fluency and scaling reasons respectively.
