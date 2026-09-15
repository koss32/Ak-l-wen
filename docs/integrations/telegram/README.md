# Telegram integration — AK LÖWEN Release 3

Telegram-бот является частью приложения AK LÖWEN и связан с его процессом записи. Это не отдельный продукт и не отдельная линия релизов.

## Роль интеграции

Telegram обеспечивает клиентский booking/status flow и staff-обработку заявок, связанных с AK LÖWEN.

## Текущий статус

**Release 3 / WIP / Preview. Production не активирован.**

Готово:

- DE/RU/UK/TR, немецкий по умолчанию;
- кнопочная навигация и FAQ;
- booking/status/cancel/staff flow;
- Redis/outbox;
- защищённые webhook/worker endpoints;
- Preview Privacy notice;
- модуль проверки членства staff в trainer group подключён к runtime и handler; новые regression tests ещё не запускались.

Осталось:

1. подтвердить trainer group и authorized staff;
2. проверить подключённую membership validation в финальных тестах и реальном staff flow;
3. настроить один authenticated minute worker trigger;
4. завершить Preview runtime configuration;
5. выполнить финальные tests/lint/build всего Release 3;
6. выполнить реальный end-to-end Preview flow.

Документы: `SETUP.md`, `ACTIVATION.md`, `VERIFICATION.md`.
