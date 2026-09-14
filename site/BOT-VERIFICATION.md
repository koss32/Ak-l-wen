# Bot verification — 2026-09-14

Run from `site/` (a temporary filesystem copy may be needed because this mounted workspace refused to create `node_modules`):

```sh
npm ci
node --test tests/bot-store.test.js tests/telegram-bot.test.js tests/telegram-api.test.js
node --test tests/bot-redis-integration.test.js
npm test
npm run lint
npm run build
```

## What the bot tests exercise

- one atomic whole-update transaction: dedupe, session/request/client/outbox commit, failure retry and concurrent CAS retry;
- opaque non-ABA revisions/fences, leased versus sending state, recovery of unstarted leases and terminal uncertainty after a sending crash;
- per-recipient runnable ordering, nonblocking future reminders and full-recipient 429 deferral;
- strong secret comparison and conservative Telegram result classification;
- actual Redis 7 Lua CAS under 24 concurrent writes, duplicate-update suppression and key TTL (not mocked Lua semantics);
- legal-pending info-only operation, complete RU minor flow, adult/minor/name/group validation, versioned/stage-bound callbacks and callback length;
- staff user+chat authorization, stale appointment fencing independent from preference revisions, strict real offset timestamp, confirmation/reschedule mechanism, exact-request reply preview;
- default-off reminders, durable identity after session expiry, `/stop`, final reminder guard infrastructure;
- HTTP host/origin, strict media type, actual bytes independent of Content-Length, malformed JSON/update rejection and nonempty >=32-character secrets.

## Exact local results

Testing was performed without live Telegram, Upstash, webhook registration, scheduler, deployment or test leads.

- Initial `npm ci` in the mounted repository: **failed** with `ENOENT` creating `site/node_modules` (filesystem limitation, not dependency resolution).
- `npm ci` in `/tmp/ak-site`: **passed** — 88 packages added, 89 audited, 0 vulnerabilities reported.
- Targeted command `node --test tests/bot-store.test.js tests/telegram-bot.test.js tests/telegram-api.test.js`: **19 passed, 0 failed**.
- `node --test tests/bot-redis-integration.test.js` against locally installed `redis-server` 7.0.15: **1 passed, 0 failed**.
- `npm test`: **37 passed, 2 failed**. Both failures are the pre-existing unrelated `tests/trial.test.js` assertions and were intentionally not changed:
  1. “age boundaries and allowed groups…” expects `directionId`, while existing validation first returns `age` for an age-15 selection outside the chosen VALSET group;
  2. “all four locales…” expects rendered `type="submit" disabled`, which the existing renderer does not output.
- `npm run lint`: **passed** for the full configured source/test scope.
- Initial `npm run build`: failed because the text-only local snapshot lacked `public/assets` (`ENOENT: scandir 'public/assets'`). The 10 original binary assets were then restored from pinned `release-2` commit `5b8662da8176c04f90e033b8da6f3174e0e30fba`, without changing their content.
- Final `npm run build` in `/tmp/ak-site` with those original assets: **passed** — 4 localized pages, 8 legal placeholders and one standalone review file.
- Independent original-baseline run (excluding all new bot tests): **17 passed, 2 failed**, reproducing the same two assertions above. Original-baseline build also passed.

## Staging/manual checks still required before activation

1. Run the Redis integration against the intended Upstash staging database as well as local Redis, and observe aggregate byte size/conflict rate.
2. Verify Telegram webhook configuration uses only `message` and `callback_query`, and test callback acknowledgements with the approved worker cadence.
3. Exercise real Telegram 200, 400, 429, 500, timeout and malformed response cases. Confirm only an authoritative 200 is `sent`, and ambiguous sends remain terminal `uncertain`.
4. Test Berlin DST spring/fall appointments and reminder quiet-hour shifts in staging with controlled clock/data.
5. Verify operator `/staff <id>`, confirm, reschedule, cancel, client opt-in/out and request-specific reply end to end with non-production accounts.
6. Publish and review privacy first; booking must remain blocked while the source status is `pending`.

## Incident notes

- **Ambiguous delivery:** do not replay automatically. Inspect Telegram/operator evidence and, if necessary, send a clearly identified manual follow-up.
- **Worker crash:** expired `leased` work can be reclaimed; expired `sending` is marked uncertain and is never reclaimed.
- **Opt-out:** `/stop` atomically disables the durable preference and cancels queued/leased reminders. HTTP already in flight cannot be retracted.
- **Capacity:** `BOT_STATE_CAPACITY_EXCEEDED` means stop intake/worker mutation and migrate/archive under reviewed procedure; do not silently fall back to memory or blindly increase the 512 KiB cap.
- **Privacy change:** disable intake until source status, deployed URL, configured status and exact consent version all agree again.
