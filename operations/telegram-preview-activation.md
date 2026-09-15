# Release 3 — Telegram Preview activation

This is the activation plan for **Release 3**. It is not evidence that the scheduler or final runtime activation is already complete.

Steps 1–2 are complete: the Privacy notice-stage Preview is published and its HTTPS document matches the approved source. Do not repeat that deployment merely to rediscover the state; continue with scheduler coordination and final runtime activation.

Owner privacy approval is recorded in `../START-HERE.md`; no additional approval of those same supplied facts is needed. Never put secrets in this file or in chat.

## Scope

- Release: **Release 3**.
- Canonical branch: `release-3`.
- Owner goal: open working booking after the final checks; handle requests in a trainer group once its identity and authorized staff are explicitly confirmed.
- Budget: zero; no paid plan or service may be enabled automatically.
- Vercel project: `ak-loewen-release-a`.
- Existing Preview alias: `https://ak-loewen-bot-preview.vercel.app`.
- Published notice: `/telegram-privacy/`, version `telegram-2026-09-15-v1`.
- Webhook: `/api/telegram-webhook/`.
- Worker: `/api/telegram-worker/`.

Use protected Vercel/scheduler access supplied to the task, and inspect the actual Preview environment before changing anything. Scheduler access is still required for the remaining activation work. Preserve the existing Preview webhook identity and isolated Redis data. Never read or mutate Production configuration/data to complete Release 3 Preview setup.

## Publication and activation order

1. Keep the already-published Privacy notice available on the Preview HTTPS alias while the booking gate remains pending.
2. Preserve the verified public Privacy version `telegram-2026-09-15-v1`.
3. For Preview activation, align:

   ```text
   PRIVACY_PUBLICATION_STATUS=published
   PRIVACY_CONSENT_VERSION=telegram-2026-09-15-v1
   PRIVACY_URL=https://ak-loewen-bot-preview.vercel.app/telegram-privacy/
   ```

   Leave `FORM_DELIVERY_ENABLED=false`; activating the native bot is not permission to activate the separate website form. Production variables stay unchanged.
4. Bind `TELEGRAM_STAFF_USER_IDS` and `TELEGRAM_STAFF_CHAT_ID` from trusted identity proof. Never authorize by username or make the first `/start` user an administrator.
5. Confirm the exact trainer group and which trainers may act before changing routing or adding IDs.
6. Complete Preview bot/Redis/worker configuration using independent secrets and the existing isolated Preview Redis prefix.
7. Connect exactly one authenticated minute worker trigger. Do not recreate or replace an existing matching job blindly.
8. Only after implementation/configuration is complete, run final focused tests, lint/build and the authorized Preview Telegram flow, including status, cancel, consent version, staff authorization and the optional two-hour reminder.
9. Production activation requires a separate decision after Release 3 verification succeeds.

## Scheduler contract

`POST https://ak-loewen-bot-preview.vercel.app/api/telegram-worker/`, every minute.

Authentication is `Authorization: Bearer <TELEGRAM_WORKER_SECRET>` in the request **header only**, not in the URL or request body. No request body is required.

If using cron-job.org, consult its current official REST API before mutation. The scheduler API credential is separate from the worker credential. Do not save authenticated payloads or secrets into Git.

Configure the job with:

- POST request method;
- exact trailing-slash worker URL;
- `Authorization` header populated privately;
- timezone `UTC`;
- every minute;
- response saving disabled;
- initially disabled, then enable only after Preview configuration is complete.

Keep scheduler IDs/status in an operational record without secrets. A created job alone is not evidence that reminders were delivered.
