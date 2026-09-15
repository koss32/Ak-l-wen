# AK LÖWEN — architecture map

This map describes the current **Release 3** structure.

## Product model

There is one application: **AK LÖWEN**.

```text
AK LÖWEN
├─ Landing / website
├─ Booking backend + API
└─ Telegram integration
   ├─ client bot flow
   ├─ staff flow
   ├─ webhook
   ├─ worker / reminders
   └─ Redis state/outbox
```

Telegram is not a separate project and does not have its own release line.

## Active branch / release

- Approved previous release: `release-2`.
- Current work: `release-3`.
- Current release status: WIP / Preview.
- Current release source of truth: `docs/releases/RELEASE-3.md`.

Do not route new work through old `feature/*`, `hoplite/*`, `codex/*`, `START-HERE`, `HANDOFF` or `CURRENT HANDOFF` pointers.

## Executable application

All runtime code is under `site/`.

### Landing

- `site/src/data.js` — programs, groups, schedules, prices, trainers, contacts and legal state.
- `site/src/locales.js` — DE/RU/UK/TR UI copy.
- `site/src/*-copy.js` — specialized copy blocks.
- `site/src/render.js` — landing markup/components.
- `site/public/style.css` — visual system and responsive styling.
- `site/public/client.js` — navigation, locale/theme behavior, forms and landing interactions.
- `site/public/scroll-motion.js` — section reveal choreography.
- `site/public/vendor/scrollcraft.*` — vendor motion runtime; do not edit for ordinary product changes.

### Landing booking backend

```text
browser form
  -> /api/trial-requests
  -> site/api/trial-requests.js
  -> site/server/hosted-trial.js
  -> Redis + Telegram delivery
```

- `site/server/validate-request.js` — authoritative request validation.
- `site/src/trial-message.js` — lead message formatting.
- `site/server/trial-requests.js` — local development delivery path.
- `site/server/hosted-trial.js` — hosted idempotency/rate-limit/delivery path.
- `site/api/trial-requests.js` — Vercel HTTP boundary.

### Telegram integration

```text
Telegram update
  -> site/api/telegram-webhook.js
  -> site/server/bot-runtime.js
  -> site/server/telegram-bot.js
  -> site/server/bot-store.js
  -> Redis aggregate / outbox

Authenticated scheduler
  -> site/api/telegram-worker.js
  -> queued delivery / reminders
  -> Telegram API
```

- `site/server/telegram-bot.js` — client and staff conversation reducer.
- `site/server/bot-runtime.js` — runtime/config boundary.
- `site/server/bot-config.js` — configuration validation/readiness.
- `site/server/bot-copy.js` — DE/RU/UK/TR Telegram copy.
- `site/server/bot-store.js` — Redis/state/outbox logic.
- `site/server/telegram-staff.js` — trainer-group membership validation support.
- `site/api/telegram-webhook.js` — protected Telegram webhook endpoint.
- `site/api/telegram-worker.js` — protected worker endpoint.
- `site/api/telegram-link.js` — intentionally disabled bridge endpoint.
- `site/public/telegram-privacy/index.html` — published Preview Privacy notice.

Current Telegram documentation is only under `docs/integrations/telegram/`.

## Build / runtime

- `site/server.js` — local runtime.
- `site/build.js` — generates localized site output and Release 3 standalone review artifact.
- `site/vercel.json` — Vercel configuration.
- `site/.env.example` — variable names only; never store real secrets.

## Tests

- `site/tests/*.test.js` — unit/integration tests used by `npm test`.
- `site/tests/browser.mjs` — browser QA.
- `site/tests/form-browser.mjs` — landing booking browser flow.
- `site/tests/mobile-locales.mjs` — locale/mobile QA.
- `site/tests/portrait-browser.mjs` — trainer portrait QA.
- `site/tests/build-review.mjs` — standalone build review.
- Telegram tests are named `telegram-*` and `bot-*` under the same `site/tests/` folder because Telegram is part of the same application.

Historical release-specific scripts are stored in `archive/technical/`, not in the active test map.

## Documentation

- `docs/releases/RELEASE-2.md` — approved previous release.
- `docs/releases/RELEASE-3.md` — current whole-project status.
- `docs/integrations/telegram/` — Telegram setup/activation/verification inside Release 3.
- `docs/legal/TELEGRAM-PRIVACY.md` — approved Telegram Privacy source.
- `docs/project/` — product requirements.
- `docs/development/README.md` — development entry point.

## Archive

Everything in `archive/` is historical/reference material. It must not override current code or Release 3 documentation.

This includes old concepts, old handoff notes, previous verification reports, previous release names and screenshots/evidence.

## Change routing

- Landing factual data → `site/src/data.js`.
- Landing copy → `site/src/locales.js` / specialized copy modules.
- Landing structure → `site/src/render.js`.
- Landing browser behavior → `site/public/client.js`.
- Landing styles → `site/public/style.css`.
- Website form delivery → `site/api/trial-requests.js` + `site/server/hosted-trial.js`.
- Telegram dialogs/flow → `site/server/telegram-bot.js` + `site/server/bot-copy.js`.
- Telegram persistence/delivery → `site/server/bot-store.js` + worker/webhook APIs.
- Trainer authorization → `site/server/telegram-staff.js` and staff handling in `telegram-bot.js`.

## End-of-work rule

Do not create another handoff file.

After a repository-changing task:

1. update the relevant `docs/releases/RELEASE-N.md` status;
2. update the relevant integration document if architecture/config changed;
3. keep the release marked WIP/Preview/approved accurately;
4. report actual checks only;
5. never promote or deploy Production merely to simplify handoff.
