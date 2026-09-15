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
- Добавлены handler/runtime regression tests этой проверки; они ещё не запускались после доработки.
- Лимит webhook увеличен до 30 секунд для membership preflight и ограниченного outbox drain.

## Не завершено

- Не выбрана и не привязана окончательная группа тренеров.
- Не подтверждён окончательный список сотрудников с правами confirm/reschedule/cancel.
- Staff membership validation подключена в коде, но ещё не проверена финальными тестами и реальными Telegram updates.
- Не завершён minute-trigger для worker.
- Не завершена финальная Preview runtime-конфигурация.
- Финальные tests/lint/build текущего Release 3 ещё не выполнены.
- Реальный end-to-end Preview-flow ещё не подтверждён.

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
