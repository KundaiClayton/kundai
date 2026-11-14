import { getCollection, type CollectionEntry } from 'astro:content';

// Same shape the pages and components used when content came from Notion.
export type ContentItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  slug: string;
  coverImage: string | null;
  coverAlt: string;
  coverCaption: string;
  contentType: string;
  featured: boolean;
  status: string;
  tags: string[];
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const formatDate = (date: Date) => `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;

const toItem = (entry: CollectionEntry<'garden'>): ContentItem => ({
  id: entry.id,
  title: entry.data.title,
  description: entry.data.description,
  date: formatDate(entry.data.date),
  slug: entry.data.slug ?? entry.id,
  coverImage: entry.data.cover ?? null,
  coverAlt: entry.data.coverAlt ?? '',
  coverCaption: entry.data.coverCaption ?? '',
  contentType: entry.data.type,
  featured: entry.data.featured,
  status: entry.data.status,
  tags: entry.data.tags,
});

const publishedEntries = async () =>
  (await getCollection('garden', entry => entry.data.published))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

export const getAllPublished = async () => (await publishedEntries()).map(toItem);

export const getContentByType = async (contentType: string) =>
  (await getAllPublished()).filter(item => item.contentType === contentType);

export const getFeaturedContent = async (contentType: string) =>
  (await getContentByType(contentType)).filter(item => item.featured);

export const getRecentContent = async (contentType: string, count = 3) =>
  (await getContentByType(contentType)).slice(0, count);

export const getContentByTag = async (tag: string) =>
  (await getAllPublished()).filter(item => item.tags.includes(tag));

export const getAllTags = async () =>
  [...new Set((await getAllPublished()).flatMap(item => item.tags))].sort();

export const getRelatedContent = async (currentId: string, tags: string[], limit = 3) =>
  (await getAllPublished())
    .filter(item => item.id !== currentId && item.tags.some(tag => tags.includes(tag)))
    .slice(0, limit);

export const getSingleBlogPostBySlug = async (slug: string) => {
  const entry = (await publishedEntries()).find(e => (e.data.slug ?? e.id) === slug);
  if (!entry) throw new Error('Published article not found.');
  const metadata = toItem(entry);
  return {
    metadata,
    markdown: entry.body ?? '',
    relatedContent: await getRelatedContent(metadata.id, metadata.tags),
  };
};
