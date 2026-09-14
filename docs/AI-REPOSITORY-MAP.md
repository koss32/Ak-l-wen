# AI Repository Map — koss32/Ak-loewen

Short mandatory entrypoint: [`/index.md`](../index.md).

Verified against repository structure on **2026-09-14**.

## Branch roles

| Branch | Role | New implementation work? |
|---|---|---|
| `Ak-loewen` | default documentation/navigation/history | Documentation only |
| `release-2` | current owner-approved website implementation | **Yes** |
| `codex/release-a` | previous release baseline | Historical comparison only |
| `codex/site-v1` | obsolete v1 implementation | **No — deprecated** |
| `feature/telegram-bot-mvp` | isolated WIP branch based on Release 2 | Only if owner explicitly resumes that task |
| backup/review/fix branches | recovery/history | Never choose automatically |

Release 2 is based on `codex/release-a` commit `3e8cd4f7eeb272f6237d2fab49a9d99712fb836b`. Approved Release 2 code baseline: `c8591e0aa1e197cdcc3eb850b174c6114467b595`.

## Default branch map

- `AGENTS.md` — repository rules; forces first read of `index.md`.
- `index.md` — dynamic current-version pointer + task router + handoff block.
- `README.md` — human-facing project summary.
- `CHANGELOG.md` — historical change log, not a current-source pointer.
- `docs/TZ-AK-LOEWEN-gGmbH-v5-source-of-truth.md` — baseline factual specification. Its old v1 routing references are historical; Release 2 supersedes them for implementation routing.
- `docs/AI-REPOSITORY-MAP.md` — this document.
- `assets/` — source/reference images.
- `concepts/` and `references/` — historical design/reference artifacts.
- `scripts/` — concept/document helpers, not the current website build.

## Current implementation dependency graph

```text
release-2/site/src/data.js
  ├─> src/render.js
  ├─> server/validate-request.js
  └─> src/trial-message.js

src/locales.js + family-copy.js + first-visit-copy.js + booking-copy.js
  └─> src/render.js
       ├─> server.js
       └─> build.js

render.js -> generated HTML + #page-data
  ├─> public/client.js
  ├─> public/style.css
  ├─> public/scroll-motion.js
  └─> public/vendor/scrollcraft.*

Browser form -> POST /api/trial-requests
  -> api/trial-requests.js
  -> server/hosted-trial.js
  -> Upstash Redis + Telegram API

Local form path
  -> server.js
  -> server/trial-requests.js
  -> SQLite + Telegram API
```

## Common change routes

### Facts: schedule / price / groups / trainer / contact

Open `release-2/site/src/data.js` first. Do not create duplicate hard-coded values elsewhere when a value belongs in the data model.

### Visible text

Generic copy: `src/locales.js`. Release 2 specialized copy: `booking-copy.js`, `family-copy.js`, `first-visit-copy.js`. Keep DE/RU/UK/TR aligned.

### HTML composition

Use `src/render.js`. Search by component/function name from `site/AI-MAP.md` rather than reading generated standalone HTML.

### Styling/responsiveness

Use `public/style.css`. The palette lives in root CSS variables. Preserve focus, mobile and reduced-motion behavior.

### Browser interaction

Use `public/client.js` for form state/validation UX, locale morphing, menus, theme, schedule filtering and glove choreography.

### Entrance/reveal animation

Use `public/scroll-motion.js`. Do not edit `public/vendor/scrollcraft.*` for ordinary application motion changes.

### Form/server delivery

Read together: `server/validate-request.js`, `src/trial-message.js`, `server/hosted-trial.js`, `api/trial-requests.js`; add `server/trial-requests.js` for local mode. Uncertain-delivery/idempotency behavior is intentional and exists to avoid duplicate leads.

## Build/runtime/config

- `site/package.json` — Node >=24, commands/dependencies.
- `site/build.js` — localized pages + legal placeholders + standalone review HTML.
- `site/server.js` — local HTTP server and local form route.
- `site/vercel.json` — Vercel build/output/security; Git deployment is disabled.
- `site/.env.example` — environment variable names only; never add real secrets.
- `site/eslint.config.js` — lint rules.

## Tests

`release-2/site/tests/` contains unit/integration/browser-oriented scripts, including `form.test.js`, `trial.test.js`, `hosted.test.js`, `upstash-integration.mjs`, `browser.mjs`, `form-browser.mjs`, `mobile-locales.mjs`, `portrait-browser.mjs`, plus historical/release review scripts.

Never claim an old successful run validates a later revision. Report exact commands/results from the current work.

## Token/context-saving rules

- Never enter `codex/site-v1` for normal implementation work.
- Do not inspect backup branches unless the task is explicitly recovery/history.
- Do not read generated multi-megabyte standalone HTML to understand source architecture.
- Do not parse DOCX if the equivalent Markdown specification is sufficient.
- Do not inspect ScrollCraft vendor internals unless the task specifically concerns the engine.
- Use `index.md` task routing and `site/AI-MAP.md` function names before broad code search.

## Production boundary

Real publication/delivery requires owner-approved legal text, server environment values, storage/Telegram configuration, and explicit authorization. Never expose tokens in HTML, commits, documentation or logs.

## Documentation maintenance

After every AI work session that changes the repository:

1. update `/index.md` `CURRENT HANDOFF` on branch `Ak-loewen`;
2. preserve the **approved** pointer unless the owner actually approved a new version;
3. record any WIP branch separately;
4. if architecture/file ownership changed, update the active implementation's `site/AI-MAP.md`;
5. give the next agent exact branch + commit + first files to open.

This protocol exists so the next model does not rediscover repository state from scratch.