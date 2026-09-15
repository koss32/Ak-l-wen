# AK LÖWEN Release 3 — Telegram Preview activation

Это план завершения Telegram-интеграции внутри Release 3, а не отдельный релиз бота.

Privacy notice уже опубликован на `https://ak-loewen-bot-preview.vercel.app/telegram-privacy/`, версия `telegram-2026-09-15-v1`.

## Порядок

1. Подтвердить trainer group и сотрудников с правами confirm/reschedule/cancel.
2. Сохранить numeric group chat ID только в защищённой runtime-конфигурации.
3. Интегрировать `site/server/telegram-staff.js` в staff handler.
4. Проверить Preview Redis/webhook/worker configuration без изменения Production.
5. Установить Privacy runtime variables из `SETUP.md`.
6. Создать или использовать ровно один authenticated minute trigger для `/api/telegram-worker/`.
7. Выполнить финальные tests/lint/build всего приложения AK LÖWEN.
8. Выполнить один реальный Preview end-to-end flow.
9. Только после успешной проверки отдельно принимать решение о Production Release 3.

Не включать Production webhook, не менять Production secrets/data и не расширять staff allowlist автоматически.
