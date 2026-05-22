# PRD 0001: Migrate from Notion CMS to Astro Content Collections + MDX

- **Status:** Proposed
- **Author:** Kundai Clayton
- **Created:** 2026-05-22
- **Target:** Phase 2 (after initial "make it mine" content pass)

## Summary

Replace the current Notion-backed CMS (`@notionhq/client` + `notion-to-md`) with Astro's native Content Collections, using `.md` and `.mdx` files committed to the repository. Posts become Git-versioned source artifacts that AI agents and CLI tools can read and write directly.

## Motivation

The site's long-term vision is a digital garden that grows over years across multiple content types (essays, notes, projects, book reviews, poems). The current Notion setup adds friction that conflicts with how Kundai actually works:

- All editing flows through a third-party API with rate limits, build-time fetches, and a fragile property-name mapping (`lib/notion.ts` has fallbacks for five possible image property names — a smell).
- AI agents and CLI tools have no first-class way to draft, edit, or programmatically extend posts.
- Posts cannot embed interactive components — they are flattened to Markdown at fetch time.
- Drafts and revisions live outside version control; there is no branch-per-draft workflow.

## Goals

1. Posts authored as `.md`/`.mdx` files in `src/content/`.
2. Type-safe frontmatter via Astro Content Collections + Zod schemas.
3. MDX support so posts can embed Astro/React components (charts, demos, callouts, code playgrounds).
4. AI agents can create, edit, and reorganise content with no API credentials.
5. Build is fully static — no runtime dependency on Notion.
6. All existing routes (`/garden`, `/blog/[slug]`, homepage featured sections) continue to work.

## Non-Goals

- Building a web-based authoring UI (mobile-friendly WYSIWYG). Editing happens in the repo via editor + AI.
- Migrating historical Notion content (none exists yet — Notion was scaffolded but not populated).
- Replacing the visual design — this is a content-layer change only.

## Advantages of This Approach

### Authoring & workflow
- **Git is the CMS.** Every edit is a commit; every draft is a branch; every revision is history. No separate "publish" workflow.
- **AI-native.** Claude, Cursor, and CLI tools can read and write posts as plain files. No OAuth, no Notion integration permissions, no schema sync.
- **Branch-per-draft.** Work on a long essay in a branch, preview it in CI, merge when ready.
- **Bulk operations are trivial.** Re-tagging 50 notes is a `grep`/`sed`/agent task, not 50 Notion clicks.

### Content power
- **Interactive posts via MDX.** Embed live React/Astro components — code demos, visualisations, expandable sections, custom callouts. Directly enables Kundai's "more interactive blog posts" vision.
- **Co-located assets.** Each post can have its own folder with images, diagrams, and components alongside the prose.
- **Type-safe frontmatter.** Zod schemas catch typos (`Featrued: true`) at build time, not after the page is live.

### Performance & ops
- **Faster builds.** No network round-trips to Notion during build. Builds go from seconds-with-network to sub-second.
- **No API limits.** Notion rate-limits to ~3 requests/second; not an issue today, painful as content grows.
- **Works offline.** Develop on a plane.
- **No secrets in env.** Remove `NOTION_API_KEY` and `NOTION_DATABASE_ID` entirely.
- **Smaller bundle.** Drop `@notionhq/client`, `notion-to-md`, `react-markdown`, `react-syntax-highlighter` (Astro/MDX handle code highlighting natively via Shiki).

### Ownership & longevity
- **Content is portable.** Markdown files outlive any specific framework, CMS, or vendor.
- **Backups are free.** GitHub is the backup; clones are forks.

## Tradeoffs Accepted

- **No mobile WYSIWYG.** Editing requires the repo. Mitigation: GitHub's web editor works on mobile in a pinch; if this becomes painful later, layer something like TinaCMS or Decap CMS on top of the same files.
- **Images live in the repo.** For a personal site this is fine; if image weight becomes a problem, move to a CDN (Cloudinary, Vercel Blob) without changing the content schema.
- **Schema changes touch all files.** Adding a required field means a migration pass. In practice rare, and AI agents handle it well.

## Proposed Content Schema

Five collections under `src/content/`:

```
src/content/
├── config.ts           # Zod schemas for all collections
├── essays/
│   └── *.mdx
├── notes/
│   └── *.md
├── projects/
│   └── *.mdx
├── book-reviews/
│   └── *.md
└── poems/
    └── *.md
```

### Shared frontmatter fields

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | Required |
| `description` | string | Required — used for cards and SEO |
| `date` | date | Required — publish or last-tended date |
| `tags` | string[] | Default `[]` |
| `status` | enum: `draft` \| `wip` \| `complete` | Default `complete` |
| `featured` | boolean | Default `false` — surfaces on homepage |
| `published` | boolean | Default `true` — drafts can stay unpublished without deleting |
| `coverImage` | image | Optional, via Astro's `image()` helper |

### Collection-specific extensions

- **projects:** `liveUrl`, `repoUrl`, `techStack: string[]`
- **book-reviews:** `author`, `bookTitle`, `rating?: number`, `finishedDate`
- **poems:** none beyond shared fields

## Implementation Plan

Each phase is independently shippable.

### Phase 1 — Foundation
- Add `@astrojs/mdx` integration.
- Create `src/content/config.ts` with Zod schemas for all five collections.
- Create one example post per collection so the build has something to render.
- Update `astro.config.mjs` to include the MDX integration.

### Phase 2 — Replace data layer
- Add `src/lib/content.ts` exposing the same functions `lib/notion.ts` exposes today:
  `getContentByType`, `getFeaturedContent`, `getRecentContent`, `getContentByTag`, `getAllTags`, `getRelatedContent`, `getSingleBlogPostBySlug`.
- Implementations use `getCollection()` instead of the Notion client.
- Components (`FeaturedEssays.astro`, `RecentNotes.astro`, `Projects.astro`, `garden.astro`) swap imports from `lib/notion` to `lib/content`. No component logic changes.

### Phase 3 — Routes
- Update `src/pages/blog/[slug].astro` to use `getStaticPaths()` from collections and render via MDX's `<Content />` component instead of `react-markdown`.
- Add `/projects`, `/reading`, `/poems` index routes (or fold into `/garden` with a type filter — decision deferred).

### Phase 4 — Cleanup
- Remove `@notionhq/client`, `notion-to-md`, `react-markdown`, `react-syntax-highlighter` from `package.json`.
- Delete `src/lib/notion.ts` and `src/components/BlogContent.tsx`.
- Delete `NOTION_API_KEY` and `NOTION_DATABASE_ID` references from `.env` and code.

### Phase 5 — MDX components library
- Build a small set of reusable MDX components under `src/components/mdx/`:
  - `<Callout type="info|warning|insight">`
  - `<Aside>` (sidebar notes)
  - `<CodeDemo>` (live React demo embed)
  - `<BookCover>` (for book reviews)
- Document usage in `docs/authoring.md`.

## Open Questions

1. **Image hosting.** Co-located in the post folder (simplest) vs `public/images/` (current) vs CDN (later). Recommend: co-located.
2. **URL structure.** Keep `/blog/[slug]` for everything, or split by type (`/essays/[slug]`, `/notes/[slug]`, `/projects/[slug]`)? Type-prefixed URLs are clearer for SEO and link sharing.
3. **Slug source.** Filename (simpler, enforced unique by filesystem) vs frontmatter (more control). Recommend: filename.
4. **Garden page filtering.** Keep current query-param filter UI, or move to static index pages per type? Current UX is fine; revisit if it gets slow.

## Success Criteria

- `pnpm build` succeeds with no Notion-related code in the bundle.
- A post written entirely in MDX (with at least one embedded interactive component) renders correctly.
- `grep -r "notion" src/` returns no results.
- Adding a new post is: create file → commit → push. Nothing else.

## Future Work Enabled by This

- AI-assisted writing flows (Claude drafts an essay in a branch, opens a PR).
- Interactive essays — anything Kundai can build as a component, he can embed in a post.
- A "garden graph" view that parses bidirectional `[[wiki-links]]` between posts (the migration to local files makes this trivial; Notion made it nearly impossible).
- RSS, sitemap, and full-text search become straightforward since all content is local.
