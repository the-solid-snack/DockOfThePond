import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** Every published post, newest first. Drafts appear only in dev. */
export async function allPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** "18 July 2026" */
export function longDate(d: Date): string {
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** "22 Jul" */
export function shortDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/** Rough reading time from the raw markdown body. */
export function readingTime(body: string | undefined): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Topic -> post count, in the order the nav should show them. */
export const TOPIC_ORDER = ['Food', 'Culture', 'Tech', 'Half-baked'];

export async function topicCounts(): Promise<{ name: string; count: number }[]> {
  const posts = await allPosts();
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.topics) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  const known = TOPIC_ORDER.map((name) => ({ name, count: counts.get(name) ?? 0 }));
  const extra = [...counts.keys()]
    .filter((n) => !TOPIC_ORDER.includes(n))
    .sort()
    .map((name) => ({ name, count: counts.get(name) ?? 0 }));
  return [...known, ...extra];
}

/** URL-safe topic slug, e.g. "Half-baked" -> "half-baked" */
export function topicSlug(topic: string): string {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
