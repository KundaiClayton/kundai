# Garden visual foundation

The two mockups in this folder are private development references, not article assets:

- **Kundai’s dark botanical digital garden.png** is the primary direction.
- **Kundai’s Bulawayo digital garden.png** supplies secondary palette and plant/soil inspiration.

The implementation uses a blue-charcoal canvas, warm text, cobalt navigation and small clay accents. Serif display type contrasts with quiet body text and monospace labels. It omits the rejected tagline and the other concept sheets. Existing reference copies in `docs/` and `src/assets/` were preserved; none are imported into the site or emitted by the build.

## First slice

`src/styles/tokens.css` owns semantic colors, typography roles, spacing, reading/site measures, radius, shadow and motion. Tailwind exposes semantic colors and display typography. Dark is the default. A shared light-mode switch now enables the warm-paper theme, persists the choice locally, and carries it through Astro navigation. Garden, archive, article, About and Now pages use semantic colors.

The homepage uses the existing published/featured essay and recent-note queries. No mock article titles or artwork are presented as published content. `GardenEntry.astro` supplies a reusable note card with readable status labels and a four-line excerpt. Empty and failed content requests have distinct messages. The shared shell supplies navigation, an archive link to `/blog`, a footer, keyboard focus and a skip link. Reduced-motion preferences disable transitions and animations.

`BotanicalSprig.astro` is an original decorative SVG, drawn in code for this slice: a dry branching stem, seed heads, a cobalt disc and clay roots. It takes plant/soil cues from the references without claiming a specific botanical species. Its colors inherit semantic tokens; it is hidden from assistive technology. It is not article artwork. No bitmap generation or public mockup assets are used.

## Stack decision

Keep locked Astro 5.0.3 and Tailwind 3.4.16 for this pass. Tailwind 4 is supported through `@tailwindcss/vite`; Astro 5.2+ automates that installation. A later migration should replace `@astrojs/tailwind`, convert the CSS directives/configuration, and verify typography and existing route utilities. It is separate from the visual foundation.

Official references:

- https://v5.docs.astro.build/en/guides/styling/
- https://tailwindcss.com/docs/installation/framework-guides/astro

## Local setup

Use Node and the pinned `pnpm@10.8.0` from `package.json`. Install with `pnpm install --frozen-lockfile`, then `pnpm dev`. The local `.env` must supply `NOTION_API_KEY` and `NOTION_DATABASE_ID`; values are intentionally not documented. The existing integration needs access to the selected Notion database and its publication schema. Static builds also need network access to Notion. Google Fonts are optional at runtime because local serif/sans/mono fallbacks are provided.

The sandboxed development session uses `ASTRO_TELEMETRY_DISABLED=1` to avoid Astro writing preferences outside the workspace. The dev server listens only on `127.0.0.1:4321`. The first install reported blocked optional build scripts. Sharp is now an explicit dependency; its native runtime and the production image build have both been verified.

## Validation and boundaries

- Production build generated all 12 pages with live Notion content.
- Existing home, garden, about, now, blog and a published article returned HTTP 200.
- Mobile layout and desktop breakpoint inspected; no horizontal page overflow found.
- Keyboard skip link reaches the content container; visible focus and reduced-motion rules included.
- Original `Projects.astro` edit and `.claude/settings.local.json` hashes match the initial inspection.
- Sharp 0.33.5 was added with its pnpm lockfile entry for static Notion image optimization; the later hosting step is recorded in `docs/DEPLOYMENT.md`.

The remaining build warning is that sitemap generation needs a canonical `site` URL. The article renderer no longer hydrates in the browser, removing its previous client chunk-size warning. No canonical URL was guessed. The garden now includes every published content type and filters those entries in the browser, including static builds; query parameters and browser navigation preserve the selected filters. The repository has no lint/test/check scripts or installed `@astrojs/check`, so validation uses its existing build and targeted browser/route checks.

## Content, image and theme follow-up

The public comparison blog listed seven entries. Four technical entries were already in the Astro archive but were omitted from the old garden because it requested only Essays and Notes. The garden now reads the complete published collection, with pagination in the source query. Single-article resolution also checks publication. Child Notion pages are not automatically expanded into an article.

Covers appear on cards and article headers; Notion-hosted covers and body images are emitted as local WebP assets at build time. The article renderer is static HTML with themed prose and code colors, removing its unnecessary client hydration. See `docs/WRITING-AND-IMAGES.md` for the authoring workflow and the difference between publishing in Notion and rebuilding the static site.

Follow-up validation: all seven comparison-blog slugs match the garden and archive and have generated article pages. The final build generated 12 pages and six optimized local WebP files; generated HTML contains no expiring Notion image URLs. Production-preview checks covered combined filters, empty results, clear, browser Back, keyboard theme switching, saved preference on reload, and seven successful route responses. Both themes and the desktop/mobile layouts were inspected.
