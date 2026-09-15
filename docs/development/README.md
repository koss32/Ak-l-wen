# AK LÖWEN development

`site/` is the executable root of one AK LÖWEN application. It contains the landing, backend/API and Telegram integration.

The folder name `site/` is kept as the technical deployment root so Vercel/build configuration is not broken; it does **not** mean the Telegram bot is a separate project.

## Run

Requires Node.js 24+.

```sh
cd site
npm ci
node server.js
```

Local routes include `/de/`, `/ru/`, `/uk/`, `/tr/` and the application APIs.

## Build

```sh
cd site
node build.js
```

Release 3 standalone review output: `dist/ak-loewen-valset-release-3.html`.

## Code areas

- `site/src/` — landing data, copy and rendering.
- `site/public/` — browser assets/behavior and Telegram Privacy page.
- `site/server/` — backend plus Telegram runtime.
- `site/api/` — Vercel endpoints for landing booking and Telegram integration.
- `site/tests/` — tests for the whole AK LÖWEN application.

See `docs/architecture/AI-MAP.md` before broad code search.
