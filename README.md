# Civics Champ

Citizenship test practice for VJ, built from his Citizenship 2.3 & 2.4 study
guide (a citizen's legal duties, civic responsibilities, and classifying
government).

- Each practice quiz is 15 questions drawn at random from a 51-question bank,
  mixing multiple choice and fill-in-the-blank (typing is forgiving of small
  spelling mistakes).
- Instant grading with a one-line "why" for every question.
- A phone-sized study sheet covering the whole guide.
- History saves every quiz with the exact questions missed and what was
  answered, plus a "Trouble questions" ranking. History lives in the browser
  on the device it's used on.

## Hosting

Single static `index.html`, no build step. Two live copies:

- **Cloudflare Pages (primary): https://civics-champ.pages.dev** — a Pages
  Function (`functions/api/scores.js`, backed by Workers KV bound as `SCORES`)
  keeps one shared history at `/api/scores`, so every device sees the same
  scores. Deployed with `npx wrangler pages deploy . --project-name
  civics-champ --branch main` (needs `CLOUDFLARE_API_TOKEN` and
  `CLOUDFLARE_ACCOUNT_ID`); deploys are manual, not tied to git pushes.
- **GitHub Pages (backup): https://chemeg8r.github.io/civics-champ/** — same
  app, static-only, so history stays per-device there.

The app detects where it's running: with `/api/scores` it syncs; without, it
falls back to this-device localStorage.
