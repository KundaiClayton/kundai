# Letters handover

Written on 23 November 2026, from PR #10 and issue #7. Anyone picking up the letters work should start here.

## Where it stands

**Built:** a local preview generator, in draft PR #10. How to run it is in [LETTERS.md](LETTERS.md).

- You write a letter as a JSON file. It's made of blocks: paragraph, heading, photos, video and link.
- `node scripts/letters/build-preview.mjs ../letter.json ../letter.html` turns it into one HTML page in the garden's colours, taken from `src/styles/tokens.css`.
- The page has:
  - an envelope you open with a demo PIN (2017)
  - optional narration in the browser's voice
  - a player for a recording
  - a photo grid that previews photos picked on your device; they aren't uploaded
  - video and link blocks, which only accept https links
- Drafts and the HTML it makes stay outside this public repo. The script refuses to write inside it, and the Astro build is unaffected.
- **Limit:** the PIN is only for show. Anyone who has the HTML file can read the letter, so don't send one to anybody yet.

**Not built:** real private delivery. That's issue #7, which is research only. No backend has been chosen.

## How the letters site should work (issue #7)

**What it's like to use**

1. Kundai writes a letter in private and chooses who it's for.
2. Kundai presses Share, and that person gets an invitation link.
3. They prove who they are with an email code, which should be easy for someone who isn't technical.
4. Every time they open the letter or a photo, the server checks they're allowed to see that letter.
5. Kundai can take access away or set an expiry date. That stops anyone opening it again, but it can't undo copies or screenshots.
6. The invitation email doesn't include the letter itself.

**Rules**

- Letters, the list of who gets them, logins and attachments never go into the public repo, the site build, feeds, the sitemap or public storage.
- A secret link, a "don't index this page" tag, or a PIN checked only in the browser doesn't count as protection.
- Errors shouldn't reveal whether a letter exists. Logs shouldn't record what letters say.
- Testing uses made-up letters and made-up people only. Don't send real invitations, sign up for paid services or move real letters until Kundai decides.

**Options to compare**

- **Supabase:** email-code sign-in, a database that only shows each person their own letters (row-level security), and private storage for photos.
- **Cloudflare:** Workers for the private pages, D1 for who-can-see-what, and private R2 for photos. A gate on the whole site isn't the same as a check on each letter.
- Something simpler, if there is one.
- Also worth considering: putting letters on their own private subdomain so the public garden stays simple.

**Issue #7 is done when** there's:

- a comparison of the options on privacy, effort for the recipient, cost and upkeep
- sketches of the flows and of where public ends and private begins
- tests showing these can't read a letter: someone not signed in, the wrong person, an expired or revoked invite, or a direct photo link
- a recommendation, plus a small set of build issues

## Next steps

1. Kundai opens the preview and decides if the design is right. Then PR #10 is merged as the design prototype, or stays a draft.
2. Do the issue #7 comparison and pick a backend. Building it is a separate decision after that.
3. Housekeeping: the old `kundaiclay` Vercel project in another account still builds every PR from this repo. Disconnect it from that account.
