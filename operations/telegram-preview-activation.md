# Telegram Preview activation — pending scheduler access

This is an activation plan, not evidence that a scheduler exists. Steps 1–2 below
are complete: the notice-stage Preview is published and its HTTPS document matches
the approved source. Evidence: `telegram-preview-state.json`. Do not repeat that
deployment merely to rediscover the state; continue with scheduler coordination
and the final runtime activation.
Owner privacy approval is recorded in `../START-HERE.md`; no additional approval
of those same supplied facts is needed. Never put secrets in this file or in chat.

## Scope

- Owner goal: open working booking after the final checks; handle requests in a
  trainer group once its identity and authorized staff are explicitly confirmed.
  Current budget is zero; no paid plan or service may be enabled automatically.
- Vercel project: `ak-loewen-release-a`.
- Existing Preview alias: `https://ak-loewen-bot-preview.vercel.app`.
- Branch: `feature/telegram-native-care-2026-09-14` (WIP, not the approved website).
- Published notice: `/telegram-privacy/`, version `telegram-2026-09-15-v1`.
- Webhook: `/api/telegram-webhook/`.
- Worker: `/api/telegram-worker/`.

Use protected Vercel/scheduler access supplied to the task, and inspect the actual
Preview environment before changing anything. Temporary Vercel access worked;
scheduler access is still missing. The ZIP deliberately contains no tokens or
numeric staff IDs; `.env.example` is not a snapshot of Vercel settings.
Preserve the existing Preview webhook identity and isolated Redis data. Never
read or mutate production configuration/data to complete this Preview task.

## Publication and activation order

1. Publish the notice to the Preview HTTPS alias while the booking gate stays
   pending. The normal build copies `public/telegram-privacy/index.html` into
   `dist/telegram-privacy/index.html`; no website redesign is involved.
2. Establish that the public notice is accessible without a login and contains
   the approved version. A local file or `READY` deployment state is not proof.
3. For the subsequent Preview activation, set source `legal.publicationStatus` to
   `published` and `legal.consentVersion` to `telegram-2026-09-15-v1`, and align:

   ```text
   PRIVACY_PUBLICATION_STATUS=published
   PRIVACY_CONSENT_VERSION=telegram-2026-09-15-v1
   PRIVACY_URL=https://ak-loewen-bot-preview.vercel.app/telegram-privacy/
   ```

   Leave `FORM_DELIVERY_ENABLED=false`; activating the native bot is not permission
   to activate the separate website form. Production variables stay unchanged.
   The local source change is already prepared, but runtime writes/deployment are
   deferred until the scheduler can be connected. Keep intake closed meanwhile.
4. Bind `TELEGRAM_STAFF_USER_IDS` and `TELEGRAM_STAFF_CHAT_ID` from the existing
   trusted identity proof. If it cannot be recovered, repeat an authenticated
   owner-controlled Telegram interaction. Never authorize by username or make the
   first `/start` user an administrator.

   The current branch already has both sensitive staff variables. Preserve them;
   do not rotate/reassign them merely because their values cannot be displayed.
   The owner subsequently requested a trainer group. Confirm that exact group and
   which trainers may act before moving staff routing or adding IDs; group
   membership or a username alone is not authorization.
5. Complete Preview bot/Redis/worker configuration using independent secrets and
   the existing isolated Preview Redis prefix. All runtime assessments must stay
   redacted; never log credentials, raw updates or customer records.
6. Connect the minute worker trigger below. Do not recreate or replace an existing
   matching job blindly. Keep it disabled until the corresponding Preview worker
   environment is ready, then enable exactly one job.
7. Only when all changes/configuration are finished, run final focused tests,
   lint/build and the authorized Preview Telegram flow, including status, cancel,
   consent version, staff allowlist and the optional two-hour reminder. Full
   relevant release verification is required before any separately approved
   Production activation. Do not replay historical suites as preliminary work.

## Scheduler contract

`POST https://ak-loewen-bot-preview.vercel.app/api/telegram-worker/`, every minute.
Authentication is `Authorization: Bearer <TELEGRAM_WORKER_SECRET>` in the request
**header only**, not in the URL or request body. No request body is required. The
worker has a 25-second drain budget inside a 30-second Vercel function.

If using cron-job.org, consult its current official REST API before the mutation:
<https://docs.cron-job.org/rest-api.html>. The scheduler API's own credential is
separate from the worker credential. Build its JSON in memory from protected
runtime values; do not save the resulting authenticated payload to disk.

Configure the job with:

- `requestMethod: 1` (POST), exact trailing-slash worker URL;
- `extendedData.headers.Authorization` populated privately;
- `schedule.timezone: "UTC"`, `expiresAt: 0`;
- `hours`, `mdays`, `minutes`, `months`, `wdays`: `[-1]`;
- `saveResponses: false` (do not retain unnecessary response bodies);
- initially `enabled: false`, then enable after Preview configuration is complete.

Keep the confirmed scheduler job ID and status in a private operational record,
not secret-bearing API responses. Never echo scheduler request headers. Inspect
the final schedule/run history only after setup is complete; a created job is not
evidence that reminders were delivered.
