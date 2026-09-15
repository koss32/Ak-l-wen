# AK LÖWEN project rules

## Project model

This repository contains one product: **AK LÖWEN**.

Its executable application contains:

- the AK LÖWEN landing page;
- backend/API used by the landing;
- the Telegram bot integration connected to the same booking/customer flow.

Telegram is an integration of AK LÖWEN, not a separate project and not a separate release line.

## Release model

- `release-2` — approved AK LÖWEN landing baseline.
- `release-3` — current AK LÖWEN release: landing + Telegram integration work.
- Future versions use `release-N` for the whole project.

Do not create separate version schemes for website, bot, handoff, agents, previews or individual subsystems.

## Read order

1. `README.md`
2. `docs/README.md`
3. relevant `docs/releases/RELEASE-N.md`
4. for Telegram work: `docs/integrations/telegram/README.md`
5. for code ownership: `docs/architecture/AI-MAP.md`

## Directory ownership

- `site/` — executable AK LÖWEN application: landing, API, server and Telegram integration.
- `docs/` — current project documentation.
- `archive/` — historical material only.
- `tools/` — development tools.

Do not create new `HANDOFF`, `START-HERE`, `CURRENT-HANDOFF`, agent-name or date-coded status files. Update the current Release document or the relevant integration document.

## Current implementation rules

- Legal/customer identity is **AK-LOEWEN gGmbH**.
- VALSET content may be presented inside the landing but is not a second repository/application.
- Keep DE/RU/UK/TR support where already implemented.
- Do not invent trainers, awards, experience, prices, schedules, contacts, legal text or testimonials.
- Secrets stay server-side and must never be committed.
- Do not enable Production delivery, Production Telegram webhook, Production scheduler or Production deployment without explicit authorization.
- Historical verification never proves a later revision.

## Code routing inside `site/`

- landing data → `src/data.js`
- landing copy → `src/locales.js`, `src/*-copy.js`
- landing markup → `src/render.js`
- browser behavior → `public/client.js`
- styles → `public/style.css`
- Telegram integration → `server/telegram-bot.js`, `server/bot-*.js`, `api/telegram-*.js`
- staff authorization → `server/telegram-staff.js`
- tests → `tests/`

After changes, update the project Release status. Do not create another handoff file.
