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

## Текущая проверка 2026-09-15 — не финальная

- Прочитаны пять текущих документов, код исследован только из `release-3`.
- Через Telegram API подтверждён существующий `@ak_loewenbot`.
- `getWebhookInfo`: URL совпадает с `https://ak-loewen-bot-preview.vercel.app/api/telegram-webhook/`, pending updates = 0, last error отсутствует. Это снимок доставки, НЕ подтверждение обработки реальной заявки.
- Vercel Preview alias обслуживает `release-3`. Release 2/Production, runtime secrets и Redis data не изменялись.
- Проверено наличие и scope env без расшифровки значений. Bot Token и Redis aliases существуют; часть bot env ещё не применима к `release-3`, Privacy runtime configuration неполная. Детали и project identity — в `SETUP.md`.
- Staff membership подключена в runtime/handler. Добавлен `site/tests/telegram-staff-flow.test.js`: fail-closed default, allowlist + group + membership, отказ при удалении сотрудника/ошибке API, перепроверка на этапах даты/commit, durable callback ACK без расходования действия при отказе, duplicate handling, runtime injection. Существующие успешные staff unit fixtures явно используют fake verifier.
- Webhook function budget увеличен до 30 секунд: прежние 10 секунд могли быть короче bounded drain даже до добавления membership preflight.
- После текущей доработки локально: `npm test` — 152 теста, 151 passed, 0 failed, 1 skipped; `npm run lint` и `npm run build` проходят. Единственный skip — Redis-интеграция без установленного `redis-server`; scheduler, Redis runtime health и реальный E2E ещё НЕ проверены. Статус остаётся WIP / Preview.

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
