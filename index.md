# AI INDEX — AK-LOEWEN gGmbH × VALSET

> **FIRST FILE FOR EVERY AI/AGENT.** Read this before repository-wide search.
> Last structure verification: **2026-09-14**.

## CURRENT HANDOFF — update after every completed AI work

<!-- AI-CURRENT-HANDOFF: keep this block short and current -->
- **Current approved implementation:** `release-2`
- **Current release-2 branch head:** `5b8662da8176c04f90e033b8da6f3174e0e30fba` — documentation/navigation update only
- **Approved website code baseline:** `c8591e0aa1e197cdcc3eb850b174c6114467b595`
- **Implementation root:** `site/` on `release-2`
- **Status:** `APPROVED SOURCE / NOT PRODUCTION-ACTIVATED`
- **Start next task with:** `index.md` → `release-2/AGENTS.md` → `release-2/site/AI-MAP.md` → only task-relevant files
- **Pending owner-requested website change:** hero/start-screen **VALSET** card should scroll to the dedicated `#valset` section; the booking/trial action inside VALSET should scroll to `#probetraining` and preserve/preselect `data-direction="valset"`. This is documented in `release-2/AGENTS.md` and is **not yet implemented**.
- **Telegram WIP branch:** `feature/telegram-bot-mvp` currently points to `c8591e0aa1e197cdcc3eb850b174c6114467b595`; it contains no committed bot implementation beyond Release 2 and is **not** an approved release
- **Deprecated v1 marker:** `codex/site-v1` head `9884d17a7abf98e9122b61c9c42b17892946217e`; historical/recovery only
- **Next-agent note:** Release 2 is authoritative. Do not spend context rediscovering v1/Release A/v2 unless the task explicitly asks for history/recovery/comparison.
<!-- /AI-CURRENT-HANDOFF -->

### Mandatory end-of-work handoff protocol

Every AI/agent that makes repository changes must, before finishing:

1. determine the exact branch and final commit containing its work;
2. decide whether that work is **approved/current** or only **work-in-progress** — never promote a WIP branch by assumption;
3. update the `CURRENT HANDOFF` block above with the current approved branch/commit and any relevant WIP pointer;
4. update the active implementation's `site/AI-MAP.md` if file ownership, architecture, endpoints, build paths or major modules changed;
5. leave the next agent a one-paragraph route: **which branch to open, which commit is current, which 1–3 files to read first, and what remains**;
6. never overwrite the approved pointer merely because a feature branch exists.

If the active implementation branch changes in the future, update this file, root `AGENTS.md`, root `README.md`, the baseline routing notice, and the active branch's `AGENTS.md`/`site/AI-MAP.md` in the same handoff.

## Repository identity

Repository: [`koss32/Ak-loewen`](https://github.com/koss32/Ak-loewen)  
Project: website and related implementation material for **AK-LOEWEN gGmbH × VALSET**.

The default branch **`Ak-loewen` is the documentation/navigation branch**. The current website code is **not** taken from the default branch; it is on `release-2`.

## Branch routing

| Purpose | Branch / location | Use |
|---|---|---|
| Documentation + AI router | [`Ak-loewen`](https://github.com/koss32/Ak-loewen/tree/Ak-loewen) | Start here |
| Current approved website | [`release-2/site/`](https://github.com/koss32/Ak-loewen/tree/release-2/site) | **Current code** |
| Release 2 instructions | [`release-2/site/RELEASE-2.md`](https://github.com/koss32/Ak-loewen/blob/release-2/site/RELEASE-2.md) | Read before material changes |
| File/function map | [`release-2/site/AI-MAP.md`](https://github.com/koss32/Ak-loewen/blob/release-2/site/AI-MAP.md) | Fast task routing |
| Standalone Release 2 preview | [`release-2/concepts/ak-loewen-valset-release-2.html`](https://github.com/koss32/Ak-loewen/blob/release-2/concepts/ak-loewen-valset-release-2.html) | Review artifact only |
| Baseline specification | [`docs/TZ-AK-LOEWEN-gGmbH-v5-source-of-truth.md`](https://github.com/koss32/Ak-loewen/blob/Ak-loewen/docs/TZ-AK-LOEWEN-gGmbH-v5-source-of-truth.md) | Facts not superseded by Release 2; routing notice at top |
| Previous release baseline | [`codex/release-a`](https://github.com/koss32/Ak-loewen/tree/codex/release-a) | Historical predecessor |
| Old v1 branch | [`codex/site-v1`](https://github.com/koss32/Ak-loewen/tree/codex/site-v1) | **DEPRECATED — do not work here** |
| Telegram bot feature branch | [`feature/telegram-bot-mvp`](https://github.com/koss32/Ak-loewen/tree/feature/telegram-bot-mvp) | Empty/WIP pointer at Release 2 code baseline unless later updated |

## Minimal reading order

For a normal website task, do **not** crawl every branch. Read only:

1. this `index.md`;
2. [`release-2/AGENTS.md`](https://github.com/koss32/Ak-loewen/blob/release-2/AGENTS.md);
3. [`release-2/site/AI-MAP.md`](https://github.com/koss32/Ak-loewen/blob/release-2/site/AI-MAP.md);
4. [`release-2/site/RELEASE-2.md`](https://github.com/koss32/Ak-loewen/blob/release-2/site/RELEASE-2.md) when the task can affect approved behavior/content;
5. only the exact implementation files named below for the requested task.

## Task → file router

| Task | First file(s) |
|---|---|
| prices, schedules, age groups, trainers, contacts, legal status | [`site/src/data.js`](https://github.com/koss32/Ak-loewen/blob/release-2/site/src/data.js) |
| DE/RU/UK/TR general copy | [`site/src/locales.js`](https://github.com/koss32/Ak-loewen/blob/release-2/site/src/locales.js) |
| booking/family/first-visit Release 2 copy | [`booking-copy.js`](https://github.com/koss32/Ak-loewen/blob/release-2/site/src/booking-copy.js), [`family-copy.js`](https://github.com/koss32/Ak-loewen/blob/release-2/site/src/family-copy.js), [`first-visit-copy.js`](https://github.com/koss32/Ak-loewen/blob/release-2/site/src/first-visit-copy.js) |
| section HTML, form markup, page composition | [`site/src/render.js`](https://github.com/koss32/Ak-loewen/blob/release-2/site/src/render.js) |
| styling, responsive layout, themes | [`site/public/style.css`](https://github.com/koss32/Ak-loewen/blob/release-2/site/public/style.css) |
| form UX, locale switching, menus, schedule filtering, glove motion | [`site/public/client.js`](https://github.com/koss32/Ak-loewen/blob/release-2/site/public/client.js) |
| reveal/entrance animation | [`site/public/scroll-motion.js`](https://github.com/koss32/Ak-loewen/blob/release-2/site/public/scroll-motion.js) |
| ScrollCraft engine | [`site/public/vendor/`](https://github.com/koss32/Ak-loewen/tree/release-2/site/public/vendor) — vendor; edit only for engine-specific work |
| request validation | [`site/server/validate-request.js`](https://github.com/koss32/Ak-loewen/blob/release-2/site/server/validate-request.js) |
| Telegram lead message formatting | [`site/src/trial-message.js`](https://github.com/koss32/Ak-loewen/blob/release-2/site/src/trial-message.js) |
| local Telegram delivery / SQLite | [`site/server/trial-requests.js`](https://github.com/koss32/Ak-loewen/blob/release-2/site/server/trial-requests.js) |
| hosted Telegram delivery / Upstash / idempotency | [`site/server/hosted-trial.js`](https://github.com/koss32/Ak-loewen/blob/release-2/site/server/hosted-trial.js) |
| Vercel request boundary | [`site/api/trial-requests.js`](https://github.com/koss32/Ak-loewen/blob/release-2/site/api/trial-requests.js) |
| local HTTP server | [`site/server.js`](https://github.com/koss32/Ak-loewen/blob/release-2/site/server.js) |
| build / standalone preview generation | [`site/build.js`](https://github.com/koss32/Ak-loewen/blob/release-2/site/build.js) |
| Vercel build/security config | [`site/vercel.json`](https://github.com/koss32/Ak-loewen/blob/release-2/site/vercel.json) |
| environment variable names | [`site/.env.example`](https://github.com/koss32/Ak-loewen/blob/release-2/site/.env.example) — values must remain secret |
| tests / QA | [`site/tests/`](https://github.com/koss32/Ak-loewen/tree/release-2/site/tests) |
| visual evidence | [`site/evidence/`](https://github.com/koss32/Ak-loewen/tree/release-2/site/evidence) |

## Directory map

### `Ak-loewen` documentation branch

- `docs/` — specifications and AI repository documentation.
- `assets/` — source/reference brand images.
- `concepts/` — historical concept artifacts on this branch; not current code.
- `references/` — historical/reference HTML.
- `scripts/` — concept/document maintenance helpers.

### `release-2` current implementation

- `site/src/` — project facts, translations, render functions, Telegram message formatter.
- `site/public/` — CSS, browser JS, runtime images, ScrollCraft vendor runtime.
- `site/server/` — validation and delivery services.
- `site/api/` — Vercel/serverless endpoint.
- `site/tests/` — tests and QA scripts.
- `site/evidence/` — screenshots/evidence.
- `site/scrollcraft/` — supporting ScrollCraft material; not a second app source.
- `site/build.js`, `server.js`, `vercel.json`, `package.json` — build/runtime/config entrypoints.

## Non-negotiable facts

- Organization: **AK-LOEWEN gGmbH × VALSET**.
- Current code source: **`release-2/site/`**.
- Four locales: **DE / RU / UK / TR**.
- AK palette: `#E85A22`, `#C4501E`, `#FF7A3D`; `#FE4123` is not the required brand color.
- VALSET keeps its navy/blue/yellow system.
- Do not invent schedules, prices, contacts, trainer facts, achievements, legal text or testimonials.
- Keep secrets server-side. Never commit tokens or credentials.
- Do not enable real form delivery, send test leads, configure production webhook/secrets, or deploy production without explicit owner authorization.
- Historical test results do not validate new changes. State exactly what was actually rerun.

## Authority order if documents disagree

1. explicit current owner instruction;
2. the `CURRENT HANDOFF` block in this file for routing only;
3. current implementation branch `AGENTS.md` + `site/RELEASE-2.md` for approved Release 2 behavior;
4. baseline specification for facts not superseded by Release 2;
5. older Release A / v1 / v2 material only as history.

## Deep map

Repository/branch/dependency details: [`docs/AI-REPOSITORY-MAP.md`](docs/AI-REPOSITORY-MAP.md).  
Implementation-level file/function details: [`release-2/site/AI-MAP.md`](https://github.com/koss32/Ak-loewen/blob/release-2/site/AI-MAP.md).

Use these maps instead of blind repository search.