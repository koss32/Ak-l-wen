# Telegram-native bot — secure setup (implemented, off by default)

The native DE/RU/UK/TR bot and durable Redis aggregate store are implemented. Nothing in this repository registers a webhook, creates a schedule, deploys, or calls Telegram during setup. Every feature flag in `.env.example` is `false`.

New users start in German, independent of Telegram's language setting. Explicit
language selection stays in the separate `🌐 Sprache` submenu and is remembered.
The FAQ is a button-based menu backed by approved first-visit copy and contact
data; it is available before booking activation and does not replace/reset a
draft. There is no AI conversation or new paid service.

The owner now wants staff handling in a group with trainers. The exact group and
authorized trainer IDs are pending confirmation; existing staff permissions must
not be widened merely because someone joins a group.

Current continuation: `../START-HERE.md`. The owner approved the supplied Telegram
privacy content and controller details on 2026-09-15. The publication-ready German
notice and supplied Russian translation are in `../privacy/telegram-privacy-approved.md`
and `public/telegram-privacy/index.html`, version `telegram-2026-09-15-v1`.
The notice is now published at
`https://ak-loewen-bot-preview.vercel.app/telegram-privacy/`. Its served contents
were matched to the approved document. Local source is prepared for that published
version; Preview runtime activation remains pending until the minute scheduler is
connected. See `../operations/telegram-preview-state.json` for deployment evidence.

## Current legal gate and info-only operation

`src/data.js` remains authoritative. Its local publication status/version now
describe the published Telegram notice, but the deployed notice-stage revision
and Preview environment still keep booking pending. With `BOT_ENABLED=true`,
`/start`, `/help`, `/location`, and language selection can operate, but `/book`
fails closed **before personal data collection**. Booking becomes available only
when all of these agree after publication and operational setup:

1. source `legal.publicationStatus === 'published'`;
2. `PRIVACY_PUBLICATION_STATUS=published`;
3. `PRIVACY_CONSENT_VERSION` exactly equals the source consent version;
4. `PRIVACY_URL` is a valid HTTPS URL for that published notice.

Intake additionally requires an enabled/configured worker path (`BOT_WORKER_ENABLED=true` plus token) and nonempty staff user/chat allowlists, so a published bot cannot silently accept requests with no delivery/admin route.

Do not change the source gate merely to activate the bot.

## Required server-only configuration

- `BOT_ENABLED`, `BOT_WEBHOOK_ENABLED`, `BOT_WORKER_ENABLED`: explicit switches; default false.
- `TELEGRAM_BOT_TOKEN`: required only by the worker when sending.
- `TELEGRAM_BOT_USERNAME`: operator/profile configuration reference.
- `TELEGRAM_STAFF_USER_IDS`: comma-separated immutable numeric Telegram user IDs.
- `TELEGRAM_STAFF_CHAT_ID`: exact allowed staff chat ID. Both user and chat must match.
- `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_WORKER_SECRET`: independent random secrets of at least 32 characters. Empty/short/malformed values are rejected.
- `PUBLIC_ORIGIN`: HTTPS origin only, with no path/query/credentials; webhook `Host` must match. HTTP is accepted only for localhost boundary tests.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (or Vercel KV aliases): required. There is no volatile production fallback.
- `BOT_REDIS_PREFIX`: optional key prefix, default `{akbot}:`; braces keep the two Lua keys in one Redis Cluster hash slot.
- `TELEGRAM_SEND_TIMEOUT_MS`: mandatory network timeout behavior; default is 8000 ms.
- privacy variables listed above.

The disabled `/api/telegram-link` endpoint intentionally returns 503. The web-to-Telegram bridge is **not implemented**: no public request ID is accepted and the existing landing intake remains independent.

## Endpoint and operator procedure

1. Provision staging Redis and deployment secrets. Never place real values in Git or browser code.
2. Keep booking gated until the published notice is reviewed and the source gate is deliberately updated.
3. Configure Telegram manually to POST to `/api/telegram-webhook`, with the configured secret header and only `message` and `callback_query` in `allowed_updates`. This repository does not call `setWebhook`.
4. Configure an external scheduler to POST `Authorization: Bearer …` to `/api/telegram-worker`. **No schedule is installed in this repository.** Run frequently enough for callback answers and reminders (for example every minute, if approved operationally).
5. Enable and verify staging before any production decision. `BOT_ENABLED=true` may be used for info-only mode while source legal status is pending; worker/webhook flags remain separately controlled.
6. Health is fail-closed behavior: disabled/missing config returns 503; wrong authentication 401; invalid webhook update 400; a valid durably committed update 200. There is no unauthenticated health endpoint.

## Implemented behavior

- Private client flow: `/start`, `/book`, `/status`, `/help`, `/faq`, `/location`, `/language`, `/cancel`, `/reminders`, `/stop`; primary navigation is through buttons.
- Adult is 18+; a minor is under 18 and requires an explicit parent/authorized-representative/legal-guardian role. Names are 2–80 characters. Programs, groups, ages and factual schedule times come from `src/data.js`/approved locale labels. A versioned privacy consent precedes contact data, and a normalized preview plus explicit submit precedes request creation.
- Requests remain pending until an authorized staff member confirms a real future ISO-8601 timestamp with offset. Staff can refresh via `/staff <request-id>`, confirm/reschedule, cancel, or compose a request-specific reply with preview. Staff cards bind immutable user allowlist + staff chat + current appointment revision.
- Reminder opt-in defaults off. Submission offers explicit choices with or without one reminder two hours before a staff-confirmed future appointment. Berlin quiet hours 21:00–08:00 are respected; past, duplicate, pending, cancelled, superseded and opted-out reminders are suppressed by an atomic final pre-send guard.
- All state changes caused by one Telegram update—including update dedupe, session/request/client changes, action tokens and outbox writes—commit as one Redis Lua CAS transaction. The reducer has no network side effects and uses one transaction nonce so retries produce the same IDs/tokens.

## Persistence, retention and delivery semantics

The production adapter stores one versioned JSON aggregate plus an opaque generation key. Lua compare-and-swap prevents lost updates/ABA; concurrent invocations retry. The aggregate is capped at 512 KiB. Sessions and callback actions retain about 30 minutes; requests, client index, update dedupe and outbox retain about 30 days. Every transaction prunes expired maps, and Redis keys themselves have a 30-day idle TTL.

Delivery is outside the state transaction. A worker leases a runnable item, then atomically calls `beginDelivery`; reminders are re-read against current status, client, opt-in, appointment and appointment revision immediately before HTTP. Expired unstarted leases return to queued. A worker crash or timeout after `beginDelivery` makes the item `uncertain`, terminal, and it is never automatically resent. Telegram success requires authoritative `ok:true` plus integer `message_id` (`answerCallbackQuery` requires `result:true`); definite 4xx fails; 429 defers the whole recipient for the full `retry_after`; malformed/5xx/network results are uncertain.

`/stop` cancels queued or leased care messages and changes the durable preference. It cannot retract an HTTP request already in flight after `beginDelivery`; that unavoidable best-effort boundary must be explained in operations/privacy handling.

## Honest scaling limit

This is a deliberately small, low-volume club design, not an enterprise queue. Every mutation reads and CAS-writes the bounded aggregate; high concurrency causes retries and 512 KiB is a hard capacity stop (`BOT_STATE_CAPACITY_EXCEEDED`). Monitor aggregate size, conflict errors, uncertain sends and worker lag. Migrate to partitioned records/stream infrastructure before volume approaches that limit rather than increasing it without review.
