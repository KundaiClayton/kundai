import { readFile } from 'node:fs/promises';

const escape = (text) => String(text ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

function httpsLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? escape(url.href) : '';
  } catch {
    return '';
  }
}

function renderBlock(block) {
  const { type, text, label, title, url } = block;
  switch (type) {
    case 'paragraph':
      return '<p data-narrate>' + escape(text) + '</p>';
    case 'heading':
      return '<h2 data-narrate>' + escape(text) + '</h2>';
    case 'video': {
      const href = httpsLink(url);
      if (!href) return '';
      return '<aside class="video"><span class="play-icon" aria-hidden="true">▶</span><div><span class="meta">' +
        escape(label || 'A video interlude') + '</span><p>' + escape(title) +
        '</p><a href="' + href + '" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></div></aside>';
    }
    case 'photos':
      return '<figure class="photos"><figcaption><span class="meta">' +
        escape(label) + '</span><p>' + escape(title) +
        '</p></figcaption><div id="photos-grid" class="photos-grid" aria-label="Photo previews"></div>' +
        '<label class="file-button">Try your photos<input id="photos-input" type="file" accept="image/*" multiple></label></figure>';
    case 'link': {
      const href = httpsLink(url);
      return href ? '<p><a href="' + href + '" target="_blank" rel="noopener noreferrer">' + escape(label) + '</a></p>' : '';
    }
    default:
      throw new Error('Unsupported letter block: ' + type);
  }
}

export async function renderLetterPreview(letter) {
  if (!letter.salutation || !Array.isArray(letter.blocks)) {
    throw new Error('A letter needs a salutation and an array of blocks.');
  }

  const [tokens, styles, script] = await Promise.all([
    readFile(new URL('../../src/styles/tokens.css', import.meta.url), 'utf8'),
    readFile(new URL('./preview.css', import.meta.url), 'utf8'),
    readFile(new URL('./preview.js', import.meta.url), 'utf8'),
  ]);

  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="referrer" content="no-referrer">
<title>A letter from Kundai</title>
<style>${tokens}\n${styles}</style>
</head>
<body>
<header class="masthead">
  <span>Kundai Clayton <span class="masthead-divider">/</span> Letters</span>
  <button class="quiet" id="theme" type="button">Light mode</button>
</header>
<main>
  <section id="envelope" class="envelope" aria-labelledby="envelope-title">
    <div class="postmark" aria-hidden="true">✳</div>
    <p class="meta">Private preview</p>
    <h1 id="envelope-title">A letter<br>from Kundai</h1>
    <form id="open-letter">
      <label for="pin" class="sr-only">Preview PIN</label>
      <input id="pin" name="pin" type="password" inputmode="numeric" maxlength="4" placeholder="PIN" required aria-describedby="pin-hint pin-error">
      <button class="primary" type="submit">Open letter</button>
    </form>
    <p class="hint" id="pin-hint">Preview PIN <strong>2017</strong></p>
    <p id="pin-error" class="error" role="alert"></p>
    <noscript><p>Enable JavaScript to open this preview.</p></noscript>
  </section>
  <div id="reading" class="reading" hidden>
    <div class="letter-tools">
      <div class="read-actions">
        <button class="quiet" id="listen" type="button" aria-expanded="false" aria-controls="audio-panel">Listen</button>
        <button class="quiet" id="close-letter" type="button">Close letter</button>
      </div>
      <section id="audio-panel" class="audio-panel" aria-label="Letter audio" hidden>
        <p class="audio-title">Listen to the letter</p>
        <div class="audio-actions">
          <button type="button" class="quiet" id="read-aloud">Try device narration</button>
          <label class="file-button">Try your recording<input id="audio-input" type="file" accept="audio/*,.m4a,.mp3,.wav"></label>
        </div>
        <audio id="audio" controls preload="metadata" hidden></audio>
        <p class="hint" id="audio-status" role="status">Your recording stays on this device for this preview.</p>
      </section>
    </div>
    <article aria-labelledby="letter-title">
      <header class="letter-header">
        <span class="meta">${escape(letter.date || 'Letter draft')}</span>
        <h1 id="letter-title" tabindex="-1" data-narrate>${escape(letter.salutation)}</h1>
      </header>
      <div class="letter-body">${letter.blocks.map(renderBlock).join('\n')}</div>
      <footer class="signature">
        ${letter.signoff ? '<p data-narrate>' + escape(letter.signoff) + '</p>' : ''}
        <p data-narrate>${escape(letter.author || 'Kundai')}</p>
      </footer>
    </article>
  </div>
</main>
<dialog id="photo-dialog" aria-labelledby="photo-title">
  <div class="photo-toolbar"><p id="photo-title">Photo preview</p><form method="dialog"><button class="quiet">Close</button></form></div>
  <img id="full-photo" alt="">
</dialog>
<script>${script}</script>
</body>
</html>`;
}
