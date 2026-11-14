# Writing stories and adding images

Every garden entry is a Markdown file in `src/content/garden/`. The site no longer reads Notion. You can still draft in Notion, but a post goes live only once its file is in this repo.

## A new entry

1. Add `src/content/garden/<name>.md`. The file name becomes the URL (`/blog/<name>`) unless you set `slug`.
2. Start it with this frontmatter:

```md
---
title: "Read less, listen more"
description: "One or two sentences for the card and search engines."
date: 2026-11-14
type: Essay          # Essay, Note, Article (technical writing), Project, Book Review
status: wip          # wip shows as Growing, complete shows as Tended
tags: ["life", "accessibility"]
featured: false      # true on an Essay puts it forward on the homepage
published: true      # false keeps it out of the build while you work on it
cover: "/garden/<name>/cover.png"   # optional
coverAlt: ""         # optional; leave empty if the cover is decorative
coverCaption: ""     # optional visible caption or credit
---
```

3. Write the body in Markdown below it.
4. Open a pull request. Merging it publishes the entry.

Keep existing slugs unchanged so old links keep working. Some older entries keep a `slug` with spaces for that reason.

## Images

Put a post's images in `public/garden/<name>/` and link them from the post:

```md
![What the image shows](/garden/<name>/diagram.png)
```

The text in the brackets is the alt text. Leave it empty for purely decorative images. A landscape cover around 1600 pixels wide works well; cards crop it to 16:9 and the article header shows it in full.

## From Notion to the garden

If you drafted in Notion, copy the text into a new file here (or ask an agent to). Download any images from Notion first: Notion's image links expire after an hour, so they can't be linked directly.

## Seeing updates

Run `pnpm dev` to see changes locally as you save. The public site updates when the change is merged and Vercel rebuilds it. See `docs/DEPLOYMENT.md`.

Light mode is available in the shared navigation. It remembers your choice in this browser. Dark mode is the initial default.
