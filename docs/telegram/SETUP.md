# Release 3 — Telegram Preview setup

Настройка относится только к Preview. Production не менять.

## Основные server-only variables

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

Права выдаются по numeric Telegram user ID и конкретному staff chat ID. Username сам по себе не является авторизацией. Перед финальным включением нужно подтвердить конкретную группу тренеров и конкретных сотрудников.

`site/server/telegram-staff.js` проверяет текущее членство через Telegram `getChatMember`; его необходимо интегрировать в staff flow до завершения Release 3.

## Worker

Используется один внешний trigger:

`POST https://ak-loewen-bot-preview.vercel.app/api/telegram-worker/`

Авторизация — `Authorization: Bearer <TELEGRAM_WORKER_SECRET>` только в header. Нужен ровно один активный minute job после того, как Preview runtime полностью настроен.

## Privacy gate

Для booking должны согласованно использоваться:

```text
PRIVACY_PUBLICATION_STATUS=published
PRIVACY_CONSENT_VERSION=telegram-2026-09-15-v1
PRIVACY_URL=https://ak-loewen-bot-preview.vercel.app/telegram-privacy/
```

`FORM_DELIVERY_ENABLED=false` оставить без изменений: Telegram Release 3 не является разрешением включить отдельную форму сайта.
