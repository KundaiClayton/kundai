# Hosting the garden

The garden is hosted in the separate Vercel project `kundai-garden`, under `kundaiclaytons-projects-5b761d8b`.

- Site: https://kundai-garden.vercel.app
- Initial deployment: https://kundai-garden-blltoxb3h-kundaiclaytons-projects-5b761d8b.vercel.app
- Private-letter exploration: https://github.com/KundaiClayton/kundai/issues/7

The existing `kundaiclayton` portfolio and `notion-blog-site` projects were not changed. Vercel automatically assigned the new project's first deployment to production even though the command did not include `--prod`.

## Release workflow

Content is Markdown in `src/content/garden/`, so a build needs no Notion keys or other secrets.

Planned setup: connect the `kundai-garden` Vercel project to `KundaiClayton/kundai` (Project settings → Git), with `develop` as the production branch. After that, merging a pull request into `develop` builds and publishes the site, and every pull request gets a preview URL.

Until that is connected, deploy by hand from a clean checkout:

```sh
pnpm install --frozen-lockfile
ASTRO_TELEMETRY_DISABLED=1 pnpm build
vercel deploy dist --yes --project kundai-garden --scope kundaiclaytons-projects-5b761d8b
```

Inspect the returned URL and check the garden, article routes, theme switch and images before promoting it to production.

The first deployment (October 2026) was a manual upload of a locally built `dist/` from uncommitted work. That redesign is now committed on this branch.

## Future private routes

The public hosting choice does not select the private-letter backend. Issue #7 explores Supabase, Cloudflare and alternatives for identity, per-letter authorization, private attachment delivery and invitations. No authenticated letter routes or private storage have been provisioned. Private letters must never enter the current public build or image pipeline.
