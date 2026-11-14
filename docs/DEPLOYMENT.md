# Hosting the garden

The garden is live at https://kundaiclayton.vercel.app (also kundai-garden.vercel.app), from the Vercel project `kundai-garden` under `kundaiclaytons-projects-5b761d8b`. In November 2026 the kundaiclayton.vercel.app address was moved here from the old `kundaiclayton` showcase project, which no longer has a public address.

## Release workflow

Content is Markdown in `src/content/garden/`, so a build needs no Notion keys or other secrets.

`kundai-garden` is connected to `KundaiClayton/kundai`, with the Astro preset and `main` as the production branch. Merging a pull request into `main` builds and publishes the site. Every pull request also gets a preview link in a Vercel comment.

An older project, `kundaiclay` (kundaiclayy.vercel.app), is also connected to this repo from a different Vercel account. It builds the same site. Disconnect or delete it from that account when it is no longer wanted.

## Future private routes

The public hosting choice does not select the private-letter backend. Issue #7 explores Supabase, Cloudflare and alternatives for identity, per-letter authorization, private attachment delivery and invitations. No authenticated letter routes or private storage have been provisioned. Private letters must never enter the current public build or image pipeline.
