# AI Implementation Map — Release 2

> Fast navigation for AI/agents. Use this instead of broad repository search.
>
> Branch: **`release-2`**. Approved code baseline: **`c8591e0aa1e197cdcc3eb850b174c6114467b595`**.  
> Canonical cross-branch pointer: [`Ak-loewen/index.md`](https://github.com/koss32/Ak-loewen/blob/Ak-loewen/index.md).

## 1. Architecture in one screen

```text
src/data.js --------------------┐
                               ├─> src/render.js -> HTML/#page-data
src/locales.js + *-copy.js ----┘                    │
                                                     ├─> public/style.css
                                                     ├─> public/client.js
                                                     ├─> public/scroll-motion.js
                                                     └─> public/vendor/scrollcraft.*

Browser form -> /api/trial-requests
  -> api/trial-requests.js
  -> server/hosted-trial.js
  -> Upstash Redis + Telegram API

Local server -> server.js
  -> server/trial-requests.js
  -> SQLite + Telegram API

Validation source -> server/validate-request.js
Telegram message -> src/trial-message.js
Static build -> build.js -> dist/* + standalone review HTML
```

## 2. Files by responsibility

| File | Owns | Do not use it for |
|---|---|---|
| `src/data.js` | programs, groups, schedules, prices, trainers, contacts, legal state, locale list | prose layout or CSS |
| `src/locales.js` | main DE/RU/UK/TR UI copy and error/status strings | factual data duplicated from `data.js` |
| `src/booking-copy.js` | specialized booking/form copy for 4 locales | form validation logic |
| `src/family-copy.js` | family/parent-facing Release 2 copy | general layout |
| `src/first-visit-copy.js` | first-visit block copy | form/server logic |
| `src/render.js` | server-rendered HTML structure/components and `#page-data` | browser state machine |
| `src/trial-message.js` | human-readable Telegram lead message | delivery/retry logic |
| `src/entry.js` | root locale-entry page | localized site pages |
| `public/style.css` | visual system, responsive layout, form/UI styling | data/content source |
| `public/client.js` | browser state, form UX, locale switching, menus, theme, schedule filters, glove motion | hosted delivery persistence |
| `public/scroll-motion.js` | section entrance/reveal choreography | glove choreography or form logic |
| `public/vendor/scrollcraft.*` | third-party/vendor ScrollCraft runtime | ordinary application changes |
| `server/validate-request.js` | authoritative server-side request validation | rendering/UI text |
| `server/trial-requests.js` | local SQLite-backed delivery state + Telegram send | hosted Upstash path |
| `server/hosted-trial.js` | hosted Upstash ledger, rate limit, idempotency, Telegram send | HTTP origin/content-type boundary |
| `api/trial-requests.js` | Vercel HTTP boundary, env/config checks, origin/type/size handling | business validation rules |
| `server.js` | local HTTP server/routes/static files/local API wiring | Vercel production config |
| `build.js` | static/localized build + standalone review generation | runtime request handling |
| `vercel.json` | Vercel build/output/security headers/function duration/deploy flag | app business logic |
| `.env.example` | environment variable names only | real secret values |
| `tests/*` | validation/delivery/browser/release checks | source-of-truth product data |

## 3. `src/data.js` — exact data areas

Exports are the navigation points:

- `locales`, `localeNames` — supported locale codes/names.
- `programs` — Boxen, Sambo & MMA, VALSET; monthly price and group IDs.
- `groups` — age bounds, program association, schedule IDs, VALSET trainer-discretion boundary policy.
- `schedules` — weekday IDs, start/end times, arrangement flag; timezone is normalized to `Europe/Berlin`.
- `trainers` — trainer identity, program relation, languages, image/portrait status, copy keys, Instagram where present.
- `contacts` — email, Telegram URL, Instagram, WhatsApp links, map and training address.
- `legal` — entity name, manager, publication/legal status, consent version.

**Impact rule:** changes here can affect renderer, client form options, validator and Telegram message. Check all consumers before changing IDs.

## 4. `src/render.js` — component/symbol map

Search these function names rather than scanning the whole file:

- `LanguageSwitcher` — DE/RU/UK/TR links + theme toggle.
- `Header` — sticky desktop/mobile navigation and mobile dialog.
- `DirectionEntry` — hero AK/VALSET entry cards.
- `Hero` — hero content and primary CTAs.
- `CourseTimes` — schedule rows inside discipline/group sections.
- `DisciplineDetails` — expanded discipline group/times/price content.
- `DisciplineCard` — collapsible Boxen/Sambo cards.
- `TrainerPortrait` — approved real portrait vs AI illustration disclosure.
- `TrainerCard` — trainer role/bio/approach/achievement presentation.
- `PriceCard` — monthly-price cards.
- `field` — reusable labeled form input markup.
- `FirstVisit` — parent/first-visit steps section.
- `TrialForm` — complete trial form markup, consent, contact method, optional details, live/demo message.
- `ContactBlock` — AK/VALSET contacts, WhatsApp/Instagram/address.
- `ValsetSection` — VALSET brand section and groups.
- `Schedule` / `ScheduleContents` — filterable schedule UI.
- `QuestionDialog` — Telegram question dialog + sticky trial link.
- `Footer` — footer navigation/legal links.
- `render` — page composition, legal placeholder pages, canonical/hreflang, `#page-data`, JS/CSS includes.

**Do not edit generated `concepts/ak-loewen-valset-release-2.html` to change the site.** Change source and rebuild.

## 5. `public/client.js` — browser function map

Search these symbols:

### Theme and basic helpers

- `applyTheme` — dark/light/system theme and `<meta name="theme-color">`.
- `status` / `error` — form status and per-field validation UI.
- `currentData` — reads current form payload from DOM.
- `syncContactMethod` — shows selected phone/email/Telegram field.

### Form option logic

- `groupOptions` — filters groups by discipline, repopulates preferred-time options, toggles VALSET Instagram hint.
- `ageSuggestion` — detects age/group mismatch and proposes compatible group.
- `validate` — client-side validation mirror for UX; server validation remains authoritative.
- `syncSubmit` — locks controls and manages submit/busy state.
- `submit` — creates/reuses request UUID, POSTs `/api/trial-requests`, preserves payload on `uncertain`/`pending` to avoid accidental duplicate submissions.

### Navigation / accessibility

- `openMenu` / `closeMenu` — mobile menu dialog, scroll lock, focus restoration.
- `openHash` — hash navigation and discipline-details opening.
- details `toggle` handler — keeps discipline accordions mutually exclusive and updates ScrollCraft layout.

### Locale switching

- `morph` — updates translated DOM while preserving form controls/state/focus-sensitive nodes.
- `changeLanguage` — fetches/morphs target locale or uses embedded standalone pages; updates canonical/alternate links and restores form/filter state.

### Motion/navigation state

- `scheduleMotion` / `frame` — decorative glove transform/opacity, VALSET artwork parallax, active nav section. Honors reduced motion.
- `headerOffset` / `updateHeaderOffset` — CSS scroll offset based on sticky header height.

### Schedule + question dialog

- `filterSchedule` — brand/direction/age filtering and result count.
- `closeQuestion` + dialog listeners — accessible Telegram question modal.

**Division of motion ownership:** glove choreography lives here; section entrance/reveal effects live in `public/scroll-motion.js`.

## 6. `public/style.css` — selector map

Search by selector/category; line numbers are intentionally not used because they become stale.

- `:root` — AK/VALSET palette, fonts, ScrollCraft CSS variables.
- global `html/body/h*/.wrap/.blk/.btn/.tlink` — base typography/layout/controls/accessibility.
- `.site-header`, `.nav-*`, `.languages`, `.menu-button`, `dialog` — navigation and mobile menu.
- `.glove-world`, `.glove-*`, `.hero*`, `.entry-*` — hero and decorative gloves.
- `.disciplines`, `.discipline*`, `.detail-*`, `.group-row`, `.course-times` — discipline detail UI.
- `.trainer-*` — trainer cards/portraits/copy.
- `.schedule-*` — schedule picker/filters/rows/status.
- `.price-*` — price cards.
- `.first-visit*` — first-visit/parent section.
- `.trial-*`, `.form-*`, `.field*`, `.consent`, `.notice` — form and validation UI.
- `.contact-*`, `.address-*` — contacts/location.
- `.about-*` — organization section.
- `.valset-*`, `.val-group*` — VALSET visual subsystem.
- footer selectors — final CTA/navigation/legal links.
- media queries near file end — tablet/mobile adaptations.
- `[data-theme="light"]` / light-theme overrides — light palette behavior.

## 7. `public/scroll-motion.js` — reveal map

This file is intentionally small and separate from glove motion.

- `groups` array maps selectors to animation kinds (`heading`, `card`, `portrait`, `price`, `step`, `scene`, `flow`).
- `stop` cancels active animation for focus/reduced-motion safety.
- `reveal` selects transform/opacity/duration based on kind/mobile state.
- `IntersectionObserver` triggers each element once.
- focus/reduced-motion/visibility listeners prevent inaccessible/perpetual motion.

Do not add another global scroll engine here. Content must remain visible without JS.

## 8. Form/server request path

### `server/validate-request.js`

`validateRequest(raw)` is the authoritative schema/consistency check:

- name/contact syntax and length;
- at least one contact;
- integer age;
- valid program/group pairing and age range;
- preferred schedule belongs to chosen group;
- comment control chars/length;
- valid locale;
- consent + exact `legal.consentVersion`;
- UUID v4 request ID.

If client validation changes, keep server behavior compatible; do not rely on browser validation for security.

### `src/trial-message.js`

`formatTrialMessage(d, receivedAt)` maps IDs to German-readable program/group/schedule labels and formats the Telegram lead card. It does not send anything.

### `server/hosted-trial.js`

- Lua `claimScript` — idempotent request claim, conflict detection, stale pending -> uncertain.
- `rateScript` — per-IP rate counter/window.
- `markScript` — delivery-state persistence without overwriting delivered state.
- `createUpstashLedger(redis)` — Redis adapter.
- `createHostedTrialService(...)` / `handle` — validate, claim, send Telegram message, classify certain failure vs uncertain result, avoid duplicate resend after ambiguous delivery.

### `api/trial-requests.js`

Vercel entrypoint checks:

- POST only;
- `FORM_DELIVERY_ENABLED === 'true'`;
- JSON content type;
- expected origin;
- content length <= 8 KiB;
- Redis env available;
- constructs Upstash + hosted service;
- uses forwarded/client IP;
- fails closed to `not_configured`/`uncertain`.

### `server/trial-requests.js`

Local development equivalent using SQLite and in-memory IP rate tracking. It marks old `pending` records `uncertain` after restart because delivery cannot be proven.

## 9. Build/local runtime

### `server.js`

- `/` -> locale-entry page.
- `/api/trial-requests` -> local API boundary/body parsing.
- `/(de|ru|uk|tr)/` + legal paths -> SSR via `render`.
- `/public` assets -> static file handling.
- local delivery only becomes live when legal/config conditions permit.

### `build.js`

- copies `public/` to `dist/`;
- generates 4 locale home pages;
- generates Impressum/Datenschutz placeholders for each locale;
- creates `dist/index.html` locale entry;
- writes `robots.txt` with `Disallow: /`;
- generates standalone `dist/ak-loewen-valset-release-2.html` with embedded CSS/JS/images and non-live page data.

### `vercel.json`

- `npm run build` -> `dist`;
- framework disabled;
- `/api/trial-requests.js` max duration 30s;
- security/privacy headers;
- `git.deploymentEnabled: false` — do not change without explicit deployment instruction.

## 10. Tests map

- `tests/form.test.js` — validation/form-domain expectations.
- `tests/trial.test.js` — local SQLite/Telegram delivery behavior.
- `tests/hosted.test.js` — hosted ledger/delivery behavior.
- `tests/upstash-integration.mjs` — Upstash path.
- `tests/browser.mjs` — browser behavior/general QA.
- `tests/form-browser.mjs` — browser form flow.
- `tests/mobile-locales.mjs` — mobile + locales.
- `tests/portrait-browser.mjs` — trainer portrait presentation.
- `tests/build-review.mjs`, `outcomes.mjs`, `release-a.mjs` — release/history-oriented review scripts; inspect before assuming they validate Release 2.

Package commands in `package.json`:

```sh
npm test
npm run lint
npm run build
```

Run browser scripts only when the appropriate browser/runtime is available, and report exactly what ran.

## 11. Generated/reference material — avoid wasting context

- `dist/` — generated output; do not treat as source.
- `concepts/ak-loewen-valset-release-2.html` — standalone generated review copy; useful for viewing, not architecture discovery.
- old v1/v2 concept HTML — historical.
- `public/vendor/scrollcraft.*` — vendor runtime; do not inspect for ordinary app work.
- `site/scrollcraft/` — supporting ScrollCraft docs/fingerprints, not application source.
- `evidence/*.png` — screenshots/evidence only.

## 12. Change-impact shortcuts

- Change group ID/schedule ID -> inspect `data.js`, client option logic, validator, Telegram formatter, tests.
- Change consent version -> inspect `data.js`, rendered `#page-data`, validator, tests, legal readiness.
- Change form field -> inspect `render.js` `TrialForm`, `client.js` `currentData/validate/submit`, `validate-request.js`, `trial-message.js`, tests.
- Change locale key -> inspect all four locales plus specialized copy merge/use sites.
- Change header height/layout -> inspect CSS + `client.js` `headerOffset/updateHeaderOffset`.
- Change glove animation -> `client.js` `scheduleMotion/frame`; not `scroll-motion.js`.
- Change entrance animation -> `scroll-motion.js`; not ScrollCraft vendor.
- Change hosted request behavior -> `api/trial-requests.js` + `hosted-trial.js` + hosted tests.

## 13. End-of-work handoff

After repository changes, update the canonical `CURRENT HANDOFF` block in [`Ak-loewen/index.md`](https://github.com/koss32/Ak-loewen/blob/Ak-loewen/index.md).

Record exact branch/commit, keep owner-approved current version separate from WIP, and update this map if feature ownership or architecture changed.
## Telegram-native bot (implemented, off by default)

```text
Telegram update -> api/telegram-webhook.js (raw 128 KiB boundary + strong secret)
  -> server/bot-runtime.js -> server/telegram-bot.js pure update reducer
  -> server/bot-store.js versioned bounded JSON aggregate
  -> Redis Lua generation CAS (dedupe + domain + action + outbox atomically)
External authenticated scheduler -> api/telegram-worker.js
  -> lease -> beginDelivery final guard -> Telegram HTTP with timeout -> terminal result
```

- `server/bot-store.js` — memory test adapter and complete Redis/Upstash aggregate
  adapter; 512 KiB capacity guard, 30-minute sessions/actions, 30-day domain/outbox/
  dedupe retention, Lua CAS with opaque generation, runnable-recipient ordering,
  leased/sending fencing, final reminder guard and conservative result classification.
- `server/telegram-bot.js` — RU/DE private intake, data-driven groups/schedules,
  adult/minor/guardian/privacy/preview validation, durable client lookup, staff card
  refresh/confirm/reschedule/cancel/reply preview, reminders and outbox drainer.
- `server/bot-runtime.js` — no volatile production fallback. Source legal `pending`
  permits info-only operation while booking remains gated by source + environment +
  exact consent version + HTTPS privacy URL.
- `api/telegram-webhook.js` / `api/telegram-worker.js` — protected Vercel boundaries.
  No webhook registration, deployment or scheduler is installed by the repository.
- `api/telegram-link.js` — intentional 503. The ownership-proofed web bridge is
  explicitly excluded; public request-ID association is not available.
- `tests/bot-*.test.js`, `tests/telegram-bot.test.js`, `tests/telegram-api.test.js` —
  complete flow, concurrency/fencing/security tests, including real local Redis Lua.
- `BOT-SETUP.md` / `BOT-VERIFICATION.md` — configuration, legal gate, retention,
  scaling limit, uncertainty runbook and exact current test evidence.

The existing `/api/trial-requests` path is unchanged. Current source legal status is
`pending`, so native booking remains unavailable until owner/legal publication work.
