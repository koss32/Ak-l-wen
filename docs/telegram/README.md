# Release 3 — Telegram

**Статус: WIP / Preview. Production не активирован.**

## Уже готово

- DE/RU/UK/TR, немецкий язык по умолчанию.
- Кнопочная навигация и FAQ.
- Запись, статус, отмена, staff-действия и опциональное напоминание.
- Redis/outbox, защищённые webhook и worker.
- Preview Privacy notice опубликован.
- Модуль проверки текущего членства сотрудника в Telegram-группе подготовлен.

## Осталось

1. Утвердить конкретную группу тренеров и сотрудников с правами действий.
2. Подключить проверку membership к staff-обработчику.
3. Настроить один защищённый minute worker trigger.
4. Завершить Preview runtime variables.
5. Выполнить финальные tests/lint/build.
6. Выполнить один реальный Preview flow: booking → staff confirmation → status/cancel → optional reminder.

## Документы

- `SETUP.md` — конфигурация.
- `ACTIVATION.md` — порядок включения Preview.
- `VERIFICATION.md` — проверки.
- `PREVIEW-STATE.json` — состояние Preview.
- `../legal/TELEGRAM-PRIVACY.md` — утверждённый Privacy source.

Код Telegram находится внутри `site/server/`, `site/api/` и `site/tests/telegram-*`.
