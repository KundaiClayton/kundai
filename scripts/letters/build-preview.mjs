import { readFile, writeFile } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderLetterPreview } from './render.mjs';

const [source, destination] = process.argv.slice(2);
if (!source || !destination) {
  throw new Error('Usage: node scripts/letters/build-preview.mjs <letter.json> <output.html>');
}

const repository = fileURLToPath(new URL('../../', import.meta.url));
function outsideRepository(path) {
  const target = resolve(path);
  const compared = relative(repository, target);
  if (compared !== '..' && !compared.startsWith('..' + sep)) {
    throw new Error('Keep letter content and generated previews outside the public checkout.');
  }
  return target;
}

const letter = JSON.parse(await readFile(outsideRepository(source), 'utf8'));
await writeFile(outsideRepository(destination), await renderLetterPreview(letter), { mode: 0o600 });
