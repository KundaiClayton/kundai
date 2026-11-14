import { getImage } from 'astro:assets';

// Keep this list aligned with astro.config.mjs. Notion uploads use expiring URLs;
// Astro emits permanent local assets for them when building the static site.
const notionHosts = new Set([
  'prod-files-secure.s3.us-west-2.amazonaws.com',
  's3.us-west-2.amazonaws.com',
  'secure.notion-static.com',
  'file.notion.so',
]);

async function prepareStoryImage(src: string) {
  const url = new URL(src);
  if (url.protocol !== 'https:') throw new Error('Story images must use HTTPS.');
  if (!notionHosts.has(url.hostname)) return { src, width: undefined, height: undefined };
  const image = await getImage({ src, inferSize: true, format: 'webp' });
  return { src: image.src, width: Number(image.attributes.width), height: Number(image.attributes.height) };
}

const buildImages = new Map<string, ReturnType<typeof prepareStoryImage>>();
export function getStoryImage(src: string) {
  const url = new URL(src);
  // Different Notion queries can sign the same immutable file differently.
  // Share the generated asset within a build, without caching expiring dev URLs.
  if (!import.meta.env.PROD || !notionHosts.has(url.hostname)) return prepareStoryImage(src);
  const key = `${url.origin}${url.pathname}`;
  const cached = buildImages.get(key);
  if (cached) return cached;
  const image = prepareStoryImage(src).catch(error => { buildImages.delete(key); throw error; });
  buildImages.set(key, image);
  return image;
}
