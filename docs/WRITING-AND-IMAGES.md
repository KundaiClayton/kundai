# Writing stories and adding images

Keep writing in the existing Notion content database. The Astro garden reads the same deliberately published entries as the other blog; you do not need to copy articles between the sites.

## A new entry

1. Create a page in the database and write in its body.
2. Give it a name, description, date and a unique slug. Keep existing slugs unchanged so existing article links continue to work.
3. Choose a `Content Type`: Essay, Note or Article (for technical writing). Other types will also appear in the garden once published.
4. Choose tags and a growth status. Growth status describes the writing; it does not grant permission to publish.
5. Keep `Published` unchecked while working privately. Check it only when the entry and all its images are ready to be public.
6. Check `Featured` on an Essay to make it eligible for the selected essay on the homepage. The homepage also shows recent Notes; the garden and archive include all published types.

## The cover image

Open the entry's database properties, find **Cover Image**, and upload the image there. Use the first image in that field as the story cover. It appears on the garden card and article header; a featured essay uses it on the homepage too.

A landscape image around 1600 pixels wide works well. Cards crop it to 16:9; the article header shows the full image. Keep essential details away from the outer edges if you want them visible in the card crop. JPG, PNG and WebP uploads are good choices. Avoid putting essential words only inside an image.

The Notion page's **Add cover** feature also works as a fallback when no file property supplies a cover. Existing compatibility fields (`Files & media`, `Cover`, `Image`, `Cover Image`, `Featured Image`) are checked in that order, before the page cover. If a different old field is populated, that field takes priority; prefer keeping only the intended cover field populated.

Optional database properties can be added as Text fields:

- `Cover Alt`: a concise description when the cover conveys information. Without it, the cover is treated as decorative.
- `Cover Caption`: an optional visible caption or image credit below the article cover.

No schema changes were made to Notion. These fields are optional and can be added when useful.

## Images inside the story

In the Notion page body, type `/image` and upload the image where it belongs. Add a caption that describes the image; the converter uses that caption as its alternative text. If the image is purely decorative, leave the caption blank. Keep explanatory information and credits in an adjacent text block if they should be visible in the article.

Uploading to Notion is the supported path for managed images. At build time, the site turns Notion-hosted covers and inline images into local WebP assets under `/_astro/`, so readers do not depend on Notion's expiring download links. The process uses Astro's Sharp image service. Build failures are surfaced instead of quietly shipping broken image links. Images linked from other external websites remain dependent on those websites.

You don't need to put article images in this Git repository when uploading through Notion. The mockups under `docs/design-references/` are development references only and do not become story images.

## Seeing updates

The garden is currently a static Astro site. Local development fetches published content when a page is requested; reload after editing Notion. A public deployment receives changes only after a fresh build and deployment. Checking `Published` alone does not trigger an automatic Astro deployment; no Notion webhook has been configured. The current public deployment and manual release workflow are recorded in `docs/DEPLOYMENT.md`.

Light mode is available in the shared navigation. It remembers your choice in this browser and applies to the homepage, garden, archive, articles, About and Now pages. Dark mode is the initial default.
