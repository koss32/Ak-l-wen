# AK-LOEWEN gGmbH × VALSET · Website v1

Текущая реализация — ветка `fix-navigation-trainer-handoff-20260913` поверх `release-a-review-20260913` (`8924001`); исходный предок — `codex/site-v1`, защищённый базовый коммит `d640c22c5f1d98f81925b5e7668fdb0b65da76c4`. Для продолжения сначала читать `../docs/HANDOFF-navigation-trainer.md`. Канонические инструкции находятся в `docs/TZ-AK-LOEWEN-gGmbH-v5-source-of-truth.md` на ветке `Ak-loewen`. Исторический v2-концепт используется только для сравнения визуального направления. Оригинальные концепты, логотипы и материалы не изменены.

## Запуск

Нужен Node.js 24 или новее. Из каталога `site`:

```sh
npm ci
npm run dev
```

Открыть http://127.0.0.1:4173/de/. Маршруты `/de/`, `/ru/`, `/uk/`, `/tr/` содержат полные локализации. Смена языка не перезагружает страницу и не сбрасывает форму. Сервер использует только встроенные модули Node; npm-зависимости нужны для проверок и подготовки изображений.

```sh
npm run build
npm test
npm run verify
```

Сборка создаёт `dist/` с четырьмя страницами, восемью юридическими заглушками и `dist/ak-loewen-valset-v1.html`: автономным файлом для просмотра без установки. Статическая сборка всегда остаётся в демонстрационном режиме. В `tests/browser.mjs` указан установленный Chrome для Windows; на другой системе скорректируйте путь браузера.

## Release A review · 13 September 2026

Review branch: `release-a-review-20260913`, derived from current implementation HEAD `e82e4692dc89e76d68684ef838d2c44c7044207c`. Canonical v5 takes priority over the historical notes below. Existing baseline backup: `backup/site-v1-d640c22-release-a`.

The refinement restores the approved orange palette, strengthens the primary hero CTA, introduces text-led trainer rows, a complete data-driven schedule, compact pricing comparisons and a three-part trial form. Existing motion and all four locales remain. This is a review build, not production; legal texts and real delivery remain disabled/pending. Release B is not included.

After starting the server, additionally run `node tests/release-a.mjs`, `node tests/mobile-locales.mjs` and `node tests/outcomes.mjs` from `site/`. The new checks cover all locales at 12 viewport widths (320–1440px), exact schedule data, keyboard focus, language-state preservation, motion and publication safeguards. The standalone review file is `dist/ak-loewen-valset-v1.html` after `npm run build`; open it directly without a server.

## Реализовано

- Порядок и визуальный характер v2, фиксированное меню, мобильное диалоговое меню, якоря и взаимоисключающие раскрывающиеся дисциплины.
- Две дисциплины AK Löwen: бокс 15+, Самбо & ММА 9–15 и 16+. Подтверждённые часы хранятся один раз и показываются внутри секций. Суббота для взрослых Самбо & ММА обозначена «по согласованию».
- Месячные цены 75 / 60 / 50 €. Одно бесплатное посещение занятия на выбор. Mama & Kind: 50 € за совместный регулярный формат, без удвоения цены.
- Полные DE/RU/UK/TR, общий адрес, руководство и отдельные контакты направлений.
- Anar Karimov с явно подписанной AI-заглушкой; Намаг Алиев с предоставленным пользователем портретом и Instagram `@aliyev__11`. Биографии и достижения не выдумывались и остаются pending.
- Настоящий scroll-craft engine с сохранённой MIT-лицензией. Независимые слои чёрных перчаток с оранжевыми деталями, плавная инерция, ограниченное движение на телефонах, статическая композиция при reduced motion. Видео и FFmpeg не нужны.
- Форма проверяет контакты, согласие и возраст. При несовпадении предлагает подходящую группу без потери данных. VALSET скрывает личные поля, предлагает копирование сообщения и открывает Instagram.

## Доставка заявок и ограничения запуска

**Настоящая отправка отключена.** Демонстрационная форма не отправляет и не сохраняет контакты. Переходы в Instagram/WhatsApp/Telegram являются обычными внешними ссылками; пользователь сам отправляет сообщение.

Подготовлен `POST /api/trial-requests`: серверная валидация, предел 8 KiB, ограничение частоты, SQLite для защиты от повторов, отправка простого текста через Telegram `sendMessage`. Успех возвращается только после `ok=true` и `message_id`. Сетевой тайм-аут остаётся неопределённым; тот же requestId не отправляется повторно. Журнал содержит только requestId, хеш данных, статус и время, без контактов. После перезапуска незавершённая доставка становится неопределённой. Такая заявка требует сверки оператором; автоматическое повторение могло бы создать дубликат. У Telegram sendMessage нет ключа идемпотентности.

Для запуска нужны:

1. Утверждённые Impressum и Datenschutz для подтверждённого юридического лица **AK-LOEWEN gGmbH**. Юридические тексты и реквизиты требуют отдельного согласования. Заменить заглушки и версию согласия, затем установить `legal.publicationStatus` в `published` только после разрешения на публикацию.
2. `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID_AK` только в серверном окружении. `.env.example` не содержит секретов. Проверить доставку в нужный чат с владельцем, затем включить публичную версию.
3. HTTPS, фактический `PUBLIC_ORIGIN`, постоянный каталог `STATE_DIRECTORY`. Он должен сохраняться между перезапусками. Реализация рассчитана на один экземпляр Node с локальным SQLite; для нескольких экземпляров необходим общий журнал и общий rate limiter. За обратным прокси лимит сейчас группирует запросы по адресу прокси; доверенные IP-заголовки намеренно не принимаются без конфигурации.
4. Убрать `noindex,nofollow` и запрет в robots.txt после готовности к публикации. Canonical и hreflang генерируются при заданном PUBLIC_ORIGIN. Публикация в этой задаче не выполнялась.

Остаются неподтверждёнными: биографии, достижения и юридические тексты. Имя, фото и Instagram тренера Самбо & ММА добавлены по сообщению пользователя. Контакты VALSET подтверждены; Telegram-номер показан текстом до проверки доступности перехода владельцем.

## Структура и происхождение

`src/data.js` — подтверждённые факты, `src/locales.js` — переводы, `src/render.js` — переиспользуемые компоненты и серверный HTML, `public/client.js` — взаимодействия, `public/style.css` — стиль, `server/trial-requests.js` — серверная доставка.

`public/assets/ak-logo.png` и `valset.jpg` скопированы из оригинальных исторических активов. Основной AK Löwen orange: `#E85A22`; light theme: `#C4501E`; lighter accent: `#FF7A3D`. `#FE4123` не использовать. Glove/coach созданы встроенным генератором специально для этой версии и оптимизированы в WebP. Репозиторий предназначен только для конкретной фирмы AK-LOEWEN gGmbH. Не подменять фирму, ветку, базовый коммит или актуальное ТЗ историческими материалами.

Scroll-craft: https://github.com/nateherkai/scroll-craft (MIT). Telegram API: https://core.telegram.org/bots/api#sendmessage. Результаты проверок и ограничения описаны в `VERIFICATION.md`.
