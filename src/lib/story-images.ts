// Story images are files in public/garden/<entry>/ (paths like /garden/<entry>/cover.png)
// or full https URLs to images hosted elsewhere. Both are served as they are.
export async function getStoryImage(src: string) {
  if (!src.startsWith('/')) {
    const url = new URL(src);
    if (url.protocol !== 'https:') throw new Error('Story images must use HTTPS.');
  }
  return { src, width: undefined, height: undefined };
}
