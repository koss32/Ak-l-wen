# Telegram — короткая передача (2026-09-15)

**Ветка:** `feature/telegram-native-care-2026-09-14`

**Последний исходный commit:** `7e26fb432350c80b6789840734263d2b9c0109a9`

**Статус:** локальные изменения не закоммичены и не запушены; Production не менялся.

## Готово локально

- Telegram-бот: DE/RU/UK/TR, первый язык DE, меню-кнопки, FAQ, заявка, статусы, staff-действия, Redis/outbox, webhook/worker защита.
- Privacy notice опубликован только на Preview: `https://ak-loewen-bot-preview.vercel.app/telegram-privacy/` (version `telegram-2026-09-15-v1`).
- Добавлен `site/server/telegram-staff.js`: безопасная проверка **текущего** членства сотрудника в заданной группе через Telegram `getChatMember`; модуль пока не подключён к обработчику.
- Документы активации: `START-HERE.md`, `operations/telegram-preview-activation.md`.

## Важно перед включением

1. Добавить бота `@ak_loewenbot` в группу владельца и выдать ему минимальные admin-права: Telegram гарантирует `getChatMember` для других участников только администратору бота.
2. Получить фактический numeric group chat ID через защищённый webhook-update; invite-link и IDs не хранить в Git.
3. Интегрировать `telegram-staff.js` так, чтобы действия разрешались только текущим людям из **этой** группы. Не разрешать по username и не расширять allowlist автоматически.
4. В cron-job.org создать ровно один disabled job: POST раз в минуту на `https://ak-loewen-bot-preview.vercel.app/api/telegram-worker/`, с `Authorization: Bearer <TELEGRAM_WORKER_SECRET>` только в header. Секреты не писать в код/чат/ZIP.
5. Только после Preview runtime + cron + group binding выполнить финальные tests/lint/build и один реальный Preview flow. До этого intake не включать.

## Проверки

По прежнему указанию владельца финальные tests/lint/build/live Telegram flow **не запускались**. Исторические результаты не подтверждают эти изменения.

Открыть сначала: `START-HERE.md`, затем `operations/telegram-preview-activation.md`, затем `site/server/bot-config.js`.
