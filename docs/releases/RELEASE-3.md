# Release 3 — AK LÖWEN

## Что это

**Release 3 — одна версия проекта AK LÖWEN.**

Она включает:

1. лендинг AK LÖWEN, основанный на утверждённом Release 2;
2. Telegram-бот как интеграцию этого же лендинга и процесса записи.

Telegram не является отдельным проектом, отдельным релизом или параллельной версией.

## Статус

**WIP / Preview. Не готово к Production.**

Release 2 остаётся утверждённой Production-базой лендинга. В Release 3 завершается связанная Telegram-интеграция и её проверка.

## Уже готово

- Лендинг из Release 2 сохранён как база.
- Telegram-бот с DE/RU/UK/TR.
- Немецкий язык по умолчанию и отдельный выбор языка.
- FAQ, запись, статус, отмена и staff-действия.
- Защищённые webhook/worker, Redis/outbox и runtime-валидация.
- Telegram Privacy notice опубликован на Preview.
- Проверка членства сотрудника через `getChatMember` подключена к runtime и staff handler: numeric allowlist + назначенная group/supergroup + актуальное членство. Ошибка проверки закрывает доступ.
- Добавлены handler/runtime regression tests этой проверки; локально выполнены `npm ci`, `npm test` (142 passed), `npm run lint` и `npm run build` на текущем snapshot.
- Добавлен защищённый Preview-only диагностический endpoint Telegram runtime; он не выдаёт secrets и не выполняет mutations.
- Лимит webhook увеличен до 30 секунд для membership preflight и ограниченного outbox drain.
- В исходном коде `release-3` staff-карточка подтверждает не введённую вручную техническую дату, а одну из тренировок соответствующей группы. Бот вычисляет ближайшее начало выбранной регулярной тренировки в `Europe/Berlin`, показывает его клиенту и использует как единственный источник времени для opt-in напоминания за два часа.
- Тренер может отдельно отправить свободный личный текст клиенту через бота; при отклонении сначала вводится и подтверждается причина, затем заявка получает статус отменённой.
- Выполнены только затронутые Telegram-тесты: 34 passed, 0 failed, 0 skipped. `npm run lint` прошёл после установки зависимостей по зафиксированному `package-lock.json`.

## Не завершено

- Telegram подтвердил актуальную trainer supergroup и права бота администратора; привязка Preview runtime должна использовать её текущий Telegram ID, а не исторический ID до миграции.
- Staff membership validation покрыта финальными локальными тестами, но реальными Telegram updates на Release-3 Preview ещё не подтверждена.
- Существующий minute-trigger остаётся выключенным до завершения deployment и E2E.
- Нужна финальная сверка Preview runtime configuration с Doppler и существующим Vercel KV без замены Redis credentials.
- Реальный end-to-end Preview-flow ещё не подтверждён.
- Изменения выбора тренировки и персонального отказа пока не развёрнуты в Preview и не проверены реальными Telegram updates.

## Что нужно сделать для завершения Release 3

1. Настроить trainer group и staff access.
2. Проверить подключённую membership validation после подтверждения группы и staff allowlist.
3. Настроить защищённый scheduler/worker trigger.
4. Завершить Preview runtime variables.
5. Выполнить финальные tests/lint/build всего приложения.
6. Проверить реальный поток: лендинг/запись → Telegram → staff → статус/отмена/напоминание.
7. После успешной проверки отдельно принять решение о Production.

## Нумерация

- **Release 2** — утверждённая предыдущая версия AK LÖWEN.
- **Release 3** — текущая версия AK LÖWEN с Telegram-интеграцией.
- Следующее изменение проекта, заслуживающее новой версии, будет **Release 4**.

Commit SHA и временные ветки — только техническая история.
