# Release 3 — Telegram bot (WIP)

**Рабочая ветка:** `release-3`

**Статус:** текущая версия разработки Telegram-бота. Это ещё не Production-релиз: финальная настройка, проверки и реальный Preview-flow не завершены.

## Что уже готово

- Telegram-бот с DE/RU/UK/TR.
- Немецкий язык по умолчанию.
- Кнопочное меню, FAQ и запись на тренировку.
- Статусы заявки и staff-действия.
- Redis/outbox, защищённые webhook и worker.
- Privacy notice опубликован на Preview: `https://ak-loewen-bot-preview.vercel.app/telegram-privacy/`.
- Подготовлен `site/server/telegram-staff.js` для проверки действующего членства сотрудника в нужной Telegram-группе.

## Что осталось завершить в Release 3

1. Привязать нужную Telegram-группу тренеров и определить сотрудников, которым разрешены действия с заявками.
2. Подключить `telegram-staff.js` к обработчику.
3. Настроить один защищённый minute-trigger для `https://ak-loewen-bot-preview.vercel.app/api/telegram-worker/`.
4. Завершить Preview runtime-конфигурацию Privacy/worker, не включая отдельную форму сайта.
5. Выполнить финальные tests/lint/build.
6. Провести один реальный Preview-flow: запись → подтверждение тренером → статус/отмена → опциональное напоминание.

## Структура релизов

- **Release 2** — утверждённая версия сайта. Не изменять в рамках Telegram-доработки.
- **Release 3** — текущая Telegram-версия, работа продолжается в `release-3`.
- Следующий номер релиза назначается только после появления следующего отдельного набора изменений; заранее `Release 4` не создаётся.

## Для следующего исполнителя

Начать с `RELEASE-3.md`, затем открыть `operations/telegram-preview-activation.md` и `site/server/bot-config.js`.

Технические commit SHA сохраняются в Git только для истории и диагностики. В рабочем общении ориентироваться на названия **Release 2 / Release 3**.
