# Hosting the garden

The garden is live at https://kundaiclayy.vercel.app, from the Vercel project `kundaiclay`.

## Release workflow

Content is Markdown in `src/content/garden/`, so a build needs no Notion keys or other secrets.

`kundaiclay` is connected to `KundaiClayton/kundai`, with `main` as the production branch. Merging a pull request into `main` builds and publishes the site. Every pull request also gets a preview link in a Vercel comment.

The project `kundai-garden` (kundai-garden.vercel.app) hosted an earlier manual upload of the redesign. In November 2026 it was disconnected from GitHub and no longer updates. Delete it when it is no longer needed.

## Future private routes

The public hosting choice does not select the private-letter backend. Issue #7 explores Supabase, Cloudflare and alternatives for identity, per-letter authorization, private attachment delivery and invitations. No authenticated letter routes or private storage have been provisioned. Private letters must never enter the current public build or image pipeline.
