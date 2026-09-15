# AK-LOEWEN project rules

## Release model

- `release-2` — approved website baseline.
- `release-3` — current Telegram/Preview work.
- Future project versions use `release-N`. Commit SHAs and temporary branch names are never user-facing version names.

## Read order

Before repository-wide work read:

1. `README.md`
2. `docs/README.md`
3. the relevant file in `docs/releases/`
4. for Telegram work: `docs/telegram/README.md`
5. for code ownership: `docs/architecture/AI-MAP.md`

## Directory ownership

- `site/` — executable application only: website, API, server, Telegram runtime, tests and deployment config.
- `docs/` — current project documentation and release state.
- `archive/` — historical material only; never use it as the implementation source unless a task explicitly asks for history/recovery.
- `tools/` — development-tool workspaces and helper material.

Do not create new `HANDOFF`, `START-HERE`, `CURRENT-HANDOFF`, random agent-name or date-coded status files. Update the appropriate release/status document instead.

## Current implementation rules

- Legal/customer identity: **AK-LOEWEN gGmbH**; VALSET is presented alongside it.
- Keep DE/RU/UK/TR support.
- Do not invent trainers, awards, experience, prices, schedules, contacts, legal text or testimonials.
- Secrets stay server-side and must never be committed.
- Do not enable Production delivery, Production Telegram webhook, Production scheduler or Production deployment without explicit authorization.
- Historical verification never proves a later revision.

## Code routing

Inside `site/`:

- factual data → `src/data.js`
- user-facing copy → `src/locales.js` and `src/*-copy.js`
- markup → `src/render.js`
- browser behavior → `public/client.js`
- styles → `public/style.css`
- Telegram runtime → `server/telegram-bot.js`, `server/bot-*.js`, `api/telegram-*.js`
- staff authorization → `server/telegram-staff.js`
- tests → `tests/`

## After changes

Update the relevant document under `docs/` and state whether the release is WIP, Preview-ready or approved. Do not create another handoff file just to describe the same state.
