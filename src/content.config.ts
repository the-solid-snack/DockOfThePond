import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * One collection: your posts.
 * Every .md file in src/content/posts becomes a page, and its
 * frontmatter must match the shape below.
 *
 * If you change this file, restart `npm run dev` afterwards.
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    topics: z.array(z.string()).default([]),
    // Optional small line above the headline on the post page.
    kicker: z.string().optional(),
    // draft: true hides it from the built site, but you still
    // see it when running locally.
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
