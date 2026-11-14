import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Every garden entry is one Markdown file in src/content/garden/.
// Images live in public/garden/<file-name>/ and are referenced as /garden/<file-name>/<image>.
const garden = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/garden' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    date: z.coerce.date(),
    // Essay, Note, Article (technical writing), Project, Book Review
    type: z.string().default('Article'),
    // complete shows as "Tended", wip as "Growing"
    status: z.enum(['complete', 'wip', 'draft']).default('complete'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    // Keep false while drafting; only published entries are built.
    published: z.boolean().default(true),
    // URL path under /blog/. Defaults to the file name.
    slug: z.string().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    coverCaption: z.string().optional(),
  }),
});

export const collections = { garden };
