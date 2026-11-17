import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per Project. The body is the Case Study; the frontmatter feeds the home-page row.
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      kind: z.string(),
      order: z.number(),
      summary: z.string(),
      tech: z.array(z.string()),
      links: z.array(z.object({ label: z.string(), href: z.url() })),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      gallery: z.array(z.object({ src: image(), alt: z.string(), caption: z.string() })).default([]),
    }),
});

export const collections = { projects };
