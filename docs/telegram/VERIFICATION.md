# Release 3 — Verification

## Исторические результаты

До текущей доработки выполнялись Telegram unit/API/Redis проверки, lint и build. Они полезны как справка, но **не подтверждают текущий Release 3**. Полный старый отчёт сохранён в `../../archive/technical/telegram-verification-2026-09-14.md`.

Зафиксированные исторические результаты включали:

- targeted Telegram tests: 19 passed / 0 failed;
- local Redis integration: 1 passed / 0 failed;
- full suite: 37 passed / 2 pre-existing baseline failures;
- lint: passed;
- build: passed после восстановления бинарных assets.

## Для текущего Release 3 ещё обязательно

После завершения group binding, staff integration, runtime и scheduler setup выполнить:

```sh
cd site
npm ci
npm test
npm run lint
npm run build
```

Затем проверить реальный Preview flow:

1. `/start` и выбор языка.
2. Booking с Privacy consent version.
3. Доставка заявки в утверждённую trainer group.
4. Staff authorization текущего участника группы.
5. Confirm/reschedule/cancel.
6. `/status` со стороны клиента.
7. Opt-in/opt-out reminder и двухчасовой reminder.
8. Отсутствие доступа у неавторизованного пользователя.

Только результаты, запущенные после финальной конфигурации Release 3, считаются финальной верификацией.
