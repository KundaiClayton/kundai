# Hosting the garden

The garden is hosted in the separate Vercel project `kundai-garden`, under `kundaiclaytons-projects-5b761d8b`.

- Site: https://kundai-garden.vercel.app
- Initial deployment: https://kundai-garden-blltoxb3h-kundaiclaytons-projects-5b761d8b.vercel.app
- Private-letter exploration: https://github.com/KundaiClayton/kundai/issues/7

The existing `kundaiclayton` portfolio and `notion-blog-site` projects were not changed. Vercel automatically assigned the new project's first deployment to production even though the command did not include `--prod`.

## Current release workflow

This release uploaded only the verified `dist/` static output: 12 pages, compiled assets, six optimized images and the favicon. It did not upload `.env` files, Notion credentials, `.claude/`, source files or design references. The checkout is linked locally through ignored `.vercel/` metadata. Vercel also created an ignored `.env.local` file for its OIDC token; never commit or share its contents.

For later previews, build locally with the existing private Notion environment and deploy the output:

```sh
pnpm install --frozen-lockfile
ASTRO_TELEMETRY_DISABLED=1 pnpm build
vercel deploy dist --dry --json --project kundai-garden --scope kundaiclaytons-projects-5b761d8b
vercel deploy dist --yes --no-wait --project kundai-garden --scope kundaiclaytons-projects-5b761d8b
```

Inspect the returned deployment URL and verify the garden, article routes, theme switch and images. Subsequent deployments default to preview. Use an explicit production deploy or promotion only when a production release is intended. Keep deployment protection enabled; `vercel curl` provides authenticated verification for protected preview URLs.

No source commit or Git push was made for this release. Automatic Git deployments and automatic Notion-triggered rebuilds have not been configured. Publishing or editing a Notion entry alone does not refresh this static deployment. A future Git-based build setup must configure the Notion build environment securely and preserve the publication boundary.

## Future private routes

The public hosting choice does not select the private-letter backend. Issue #7 explores Supabase, Cloudflare and alternatives for identity, per-letter authorization, private attachment delivery and invitations. No authenticated letter routes or private storage have been provisioned. Private letters must never enter the current public build or image pipeline.
