# Release 3 — Telegram Preview activation

Это план завершения Preview, а не подтверждение завершённой активации.

Privacy notice уже опубликован на `https://ak-loewen-bot-preview.vercel.app/telegram-privacy/`, версия `telegram-2026-09-15-v1`.

## Порядок

1. Подтвердить конкретную trainer group и сотрудников с правами confirm/reschedule/cancel.
2. Получить и сохранить numeric group chat ID только в защищённой runtime-конфигурации.
3. Интегрировать `site/server/telegram-staff.js` в staff handler.
4. Проверить Preview Redis/webhook/worker configuration без чтения или изменения Production.
5. Установить Privacy runtime variables из `SETUP.md`.
6. Создать или использовать ровно один authenticated minute trigger для `/api/telegram-worker/`; не создавать дубликат существующего job.
7. Выполнить финальные tests/lint/build.
8. Выполнить один реальный Preview end-to-end flow.
9. Только после успешной проверки отдельно принимать решение о Production.

## Границы

- Не включать Production webhook.
- Не менять Production secrets/data.
- Не включать форму сайта через `FORM_DELIVERY_ENABLED`.
- Не расширять staff allowlist автоматически по username или факту вступления в группу.
- Не записывать Telegram/worker/scheduler secrets в Git.
