# Development

Рабочее приложение находится целиком в `site/`.

## Запуск

Требуется Node.js 24+.

```sh
cd site
npm ci
node server.js
```

Локальный сервер: `http://127.0.0.1:4173/` с локалями `/de/`, `/ru/`, `/uk/`, `/tr/`.

## Build

```sh
cd site
node build.js
```

Для ветки Release 3 standalone review-файл создаётся как `dist/ak-loewen-valset-release-3.html`.

## Основные каталоги

- `site/src/` — данные, локали и HTML rendering.
- `site/public/` — клиентский JS, CSS и публичные assets.
- `site/server/` — серверная логика, включая Telegram runtime.
- `site/api/` — Vercel/API endpoints.
- `site/tests/` — автоматические проверки.

Подробная карта: `docs/architecture/AI-MAP.md`.
