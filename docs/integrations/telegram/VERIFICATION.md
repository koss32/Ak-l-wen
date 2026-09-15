# AK LÖWEN Release 3 — Telegram verification

Telegram проверяется как часть единого Release 3.

## Исторические результаты

До текущей доработки выполнялись Telegram unit/API/Redis проверки, lint и build. Они полезны как история, но не подтверждают текущий Release 3. Старый полный отчёт: `../../../archive/technical/telegram-verification-2026-09-14.md`.

Исторически фиксировались:

- targeted Telegram tests: 19 passed / 0 failed;
- local Redis integration: 1 passed / 0 failed;
- full suite: 37 passed / 2 pre-existing baseline failures;
- lint: passed;
- build: passed после восстановления binary assets.

## Финальная проверка Release 3

После group binding, staff integration, runtime и scheduler setup:

```sh
cd site
npm ci
npm test
npm run lint
npm run build
```

Затем проверить связанный flow AK LÖWEN:

1. клиент открывает/использует процесс записи;
2. Telegram `/start` и выбор языка;
3. booking с Privacy consent;
4. заявка поступает в утверждённую trainer group;
5. staff authorization;
6. confirm/reschedule/cancel;
7. клиентский `/status`;
8. reminder opt-in/opt-out и двухчасовой reminder;
9. отказ доступа неавторизованному пользователю.

Только результаты после финальной конфигурации считаются верификацией Release 3.
