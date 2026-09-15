# AK LÖWEN Release 3 — Telegram setup

Это конфигурация Telegram-интеграции приложения AK LÖWEN для Preview. Production не менять.

## Существующая инфраструктура — проверено 2026-09-15

- Рабочая ветка: только `release-3` в `koss32/Ak-loewen`.
- Vercel project: `ak-loewen-release-a`, ID `prj_0kG9RBjUgIn4UktNF1qYU0cCgRvU`; root directory `site`.
- Team: `zumeeeeer-6684s-projects`, ID `team_j4dElwkGk5L6ODyrhxQRW1N5`.
- Preview alias: `ak-loewen-bot-preview.vercel.app`. На момент проверки он ещё НЕ переведён на `release-3`; состояние deployment READY само по себе не является проверкой Release 3.
- Production branch проекта — `Ak-loewen`; её, production aliases и secrets не менять.
- Автоматическое развёртывание Git отключено в `site/vercel.json`. GitHub commit не означает deployment: создать Preview deployment именно из `release-3`, проверить Git source и только после готовности назначить Preview alias.
- Bot Token и управляемые Redis credentials уже существуют для Preview. Redis подключён через `KV_REST_API_URL` / `KV_REST_API_TOKEN`, поддерживаемые текущим runtime. Переменные с именами `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` на момент проверки отсутствуют; это не основание создавать новый Redis или извлекать существующие credentials.
- Часть bot-переменных привязана к нерабочей исторической ветке и пока не применяется к `release-3`. Это только обнаруженная проблема scope, не источник истины для кода, Privacy или списка staff.
- `PRIVACY_CONSENT_VERSION` и `PRIVACY_URL` в проекте пока отсутствуют. Runtime activation ещё не выполнена.

Проверять Environment Variables через Vercel UI или REST API metadata: `GET /v10/projects/{projectId}/env?decrypt=false&teamId={teamId}`. Возвращать только имена, scope/target, тип и наличие. Никогда не вызывать endpoint расшифрованного значения, не использовать `decrypt=true`, `vercel env pull`, не сохранять raw project/env/deployment responses. Скрытая/write-only переменная — нормальное состояние. После изменения env требуется новый deployment.

Долговременные runtime credentials принадлежат Vercel и соответствующим сервисам. Доступ агента к management API — лишь инструмент обслуживания и не должен участвовать в работе бота.

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
- `FORM_DELIVERY_ENABLED` (отдельный landing delivery gate)

Секреты не хранить в Git, документации, URL или логах.

## Staff

Права выдаются по numeric Telegram user ID и конкретному staff chat ID. Username сам по себе не является авторизацией.

`site/server/telegram-staff.js` подключён через `bot-runtime.js` в staff flow. Проверка допуска требует одновременно numeric allowlist, назначенную group/supergroup и текущее членство через `getChatMember`. Бот должен быть администратором этой группы. Проверка выполняется перед каждым staff callback/message вне синхронной Redis-транзакции. При отказе/ошибке проверки права не выдаются и действие не расходуется; callback acknowledgement остаётся durable. Неавторизованные и посторонние сообщения в trainer group игнорируются. Default verifier без runtime injection закрывает доступ, а не разрешает его.

Новые handler/runtime tests подготовлены, но ещё не запускались после полной runtime-конфигурации.

## Worker

Preview worker endpoint:

`POST https://ak-loewen-bot-preview.vercel.app/api/telegram-worker/`

Авторизация: `Authorization: Bearer <TELEGRAM_WORKER_SECRET>` в header. После полной настройки Preview нужен ровно один active minute job.

На момент проверки job и его работа не подтверждены. Сначала выяснить, есть ли существующее задание, и исправить его, не создавать дубль. Текущий Vercel team использует Hobby; встроенный Vercel Cron не подходит для требуемого minute POST (Hobby допускает только daily cadence, Vercel Cron вызывает GET). Нужен самостоятельный внешний scheduler, а не Tasklet automation. Если скрытый worker secret невозможно использовать для настройки header, безопасно сгенерировать новый и обновить Vercel + scheduler без раскрытия значения. Redis/state и webhook secret ради этого не менять.

## Privacy gate

```text
PRIVACY_PUBLICATION_STATUS=published
PRIVACY_CONSENT_VERSION=telegram-2026-09-15-v1
PRIVACY_URL=https://ak-loewen-bot-preview.vercel.app/telegram-privacy/
```

`FORM_DELIVERY_ENABLED=false` не менять автоматически: включение Telegram-интеграции не является разрешением менять Production/landing delivery.
