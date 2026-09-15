# AK LÖWEN Release 3 — Telegram setup

Это конфигурация Telegram-интеграции приложения AK LÖWEN для Preview. Production не менять.

## Server-only variables

- `BOT_ENABLED`
- `BOT_WEBHOOK_ENABLED`
- `BOT_WORKER_ENABLED`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_BOT_USERNAME`
- `TELEGRAM_STAFF_USER_IDS`
- `TELEGRAM_STAFF_CHAT_ID`
- `TELEGRAM_WEBHOOK_SECRET`
- `TELEGRAM_WORKER_SECRET`
- `PUBLIC_ORIGIN`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `BOT_REDIS_PREFIX`
- `PRIVACY_PUBLICATION_STATUS`
- `PRIVACY_CONSENT_VERSION`
- `PRIVACY_URL`

Секреты не хранить в Git, документации, URL или логах.

## Staff

Права выдаются по numeric Telegram user ID и конкретному staff chat ID. Username сам по себе не является авторизацией.

`site/server/telegram-staff.js` проверяет текущее членство через Telegram `getChatMember`; его нужно интегрировать в staff flow до завершения Release 3.

## Worker

Preview worker endpoint:

`POST https://ak-loewen-bot-preview.vercel.app/api/telegram-worker/`

Авторизация: `Authorization: Bearer <TELEGRAM_WORKER_SECRET>` в header. После полной настройки Preview нужен ровно один active minute job.

## Privacy gate

```text
PRIVACY_PUBLICATION_STATUS=published
PRIVACY_CONSENT_VERSION=telegram-2026-09-15-v1
PRIVACY_URL=https://ak-loewen-bot-preview.vercel.app/telegram-privacy/
```

`FORM_DELIVERY_ENABLED=false` не менять автоматически: включение Telegram-интеграции не является разрешением менять Production/landing delivery.
