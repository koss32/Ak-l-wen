# AK-LOEWEN gGmbH × VALSET

Этот репозиторий использует простую нумерацию релизов.

## Текущие версии

| Релиз | Статус | Ветка | Назначение |
| --- | --- | --- | --- |
| **Release 2** | утверждён | `release-2` | утверждённая версия сайта |
| **Release 3** | WIP / Preview | `release-3` | Telegram-бот и его Preview-интеграция |

Release 3 основан на Release 2. Production не активирован и не должен меняться до завершения проверок Release 3.

## Структура репозитория

- `site/` — только рабочий код сайта, API и Telegram-бота.
- `docs/` — актуальная документация проекта.
- `archive/` — исторические концепты, старые проверки и материалы до текущей структуры. Не использовать как source of truth.
- `tools/` — служебные инструменты разработки.

Начинать работу нужно с [`docs/README.md`](docs/README.md).

Для текущего Release 3:

1. [`docs/releases/RELEASE-3.md`](docs/releases/RELEASE-3.md)
2. [`docs/telegram/README.md`](docs/telegram/README.md)
3. [`docs/development/README.md`](docs/development/README.md)

Технические commit SHA и старые feature/hoplite/codex-названия не являются версиями проекта.
