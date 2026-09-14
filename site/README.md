# AK-LOEWEN gGmbH × VALSET · Release 2

## AI / developer start

Before broad search:

1. read the canonical router: https://github.com/koss32/Ak-loewen/blob/Ak-loewen/index.md
2. read [`AI-MAP.md`](AI-MAP.md) for exact file/function ownership;
3. read [`RELEASE-2.md`](RELEASE-2.md) for approved Release 2 decisions/limitations;
4. open only task-relevant source files.

Current implementation is `site/` on branch `release-2`. `codex/site-v1` is deprecated and must not be used for new implementation work.

## Run

Requires Node.js 24+. From `site/`:

```sh
npm ci
node server.js
```

Local server: `http://127.0.0.1:4173/ru/`; also `/de/`, `/uk/`, `/tr/`.

## Build / review

```sh
node build.js
```

This creates localized pages in `dist/` and `dist/ak-loewen-valset-release-2.html`. A ready standalone review copy lives at `../concepts/ak-loewen-valset-release-2.html`.

The standalone file is a review artifact and does **not** submit applications. Ordinary built pages use the existing `FORM_DELIVERY_ENABLED` switch; do not enable real delivery without explicit authorization.

## Main source files

- `src/data.js` — confirmed programs/groups/schedules/prices/trainers/contacts/legal state.
- `src/locales.js` — main DE/RU/UK/TR copy.
- `src/family-copy.js`, `first-visit-copy.js`, `booking-copy.js` — Release 2 specialized copy.
- `src/render.js` — HTML structure/components/form markup.
- `public/style.css` — visual system/themes/responsive layout.
- `public/client.js` — form UX, locale switching, navigation, schedule filters, glove animation.
- `public/scroll-motion.js` — section entrance/reveal choreography.
- `server/validate-request.js` — authoritative request validation.
- `src/trial-message.js` — Telegram lead-message formatter.
- `server/trial-requests.js` — local SQLite delivery service.
- `server/hosted-trial.js`, `api/trial-requests.js` — hosted Upstash/Vercel delivery path.
- `build.js`, `server.js`, `vercel.json` — build/local runtime/Vercel config.

See [`AI-MAP.md`](AI-MAP.md) before editing large files; it maps functions/selectors to responsibilities.

## Delivery / publication boundary

AK Löwen and VALSET use one configured Telegram intake; Instagram remains optional for VALSET. Secrets must stay server-side.

Publication requires approved Impressum/Datenschutz, agreed hosting/configuration and explicit owner permission. Do not deploy, enable delivery, configure production webhook/secrets or send test leads without authorization.

Historical verification is not proof for a new revision. Run and report only the checks actually executed.

## Handoff rule

Every AI/agent that changes the repository must update the `CURRENT HANDOFF` block in the default-branch `index.md` before finishing, while keeping approved and WIP versions clearly separate.