# Letters preview

The letter preview borrows the garden’s colours and has an envelope, an optional audio player, and inline photo and video blocks. It is a local design prototype for the private letter flow in GitHub issue #7.

Keep drafts and generated HTML outside this public repository. Create a JSON file such as `../letter.json` with fictional content for a demo:

```json
{
  "salutation": "Dear friend,",
  "date": "Letter draft",
  "author": "Kundai",
  "signoff": "Take care,",
  "blocks": [
    { "type": "paragraph", "text": "I found an old photo today." },
    { "type": "photos", "label": "From the photo album", "title": "An afternoon together" },
    { "type": "heading", "text": "Looking back" },
    { "type": "paragraph", "text": "I’m glad our paths crossed." }
  ]
}
```

Run `node scripts/letters/build-preview.mjs ../letter.json ../letter.html` and open the HTML file in a browser. The demo PIN is **2017**. Try a local recording or select photos to preview their placement. The file selections last for the current page and are never uploaded. Device narration uses an installed local English voice when the browser offers one. Video and link blocks require an HTTPS URL and open separately.

The PIN in this HTML previews the interaction. Anyone with the file can read the embedded letter, so treat the file as a copy of the draft. Before recipient delivery, implement the server checks and private attachment handling outlined in issue #7. The local generator is separate from Astro’s public build.
