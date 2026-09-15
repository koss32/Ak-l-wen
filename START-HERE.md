# Telegram continuation — 15 September 2026

## Current state

The owner confirmed the updated `telegram-privacy-draft.md` attachment on
2026-09-15. The controller details and supplied privacy content are approved by the
owner; do not ask for that same approval again. This is not an independent legal
review. Subsequent HTTPS publication is recorded separately in
`operations/telegram-preview-state.json`.

- Controller: AK-LOEWEN gGmbH, represented by Dietrich Schmelzer.
- Registered address: Parallelstraße 6, 42719 Solingen.
- Contact: aklggmbh@gmail.com, +49 157 30447730.
- Register: Amtsgericht Wuppertal, HRB 36478.
- Training address remains Werwolf 8, 42651 Solingen, not the registered address.
- Published notice: `https://ak-loewen-bot-preview.vercel.app/telegram-privacy/`,
  version `telegram-2026-09-15-v1`.
- German notice and supplied Russian translation:
  `privacy/telegram-privacy-approved.md` and
  `site/public/telegram-privacy/index.html`.

The current Telegram code and associated tests were restored from the owner's
`ak-loewen-telegram-handoff-2026-09-14 (1).zip`, without importing unrelated website
files. DE/RU/UK/TR dialogs, language submenu, opt-in two-hour reminders, staff
actions, protected webhook/worker, storage and runtime validation are already
implemented. Do not rebuild them or recursively audit the archive.

## Exact local work / publication boundary

### Latest owner decisions (2026-09-15)

- The goal is to open working booking for real clients after final verification,
  not merely package the source. This is not permission to move the unrelated
  website to Production or publish to GitHub.
- Requests should be handled in a Telegram group with trainers; `@koss320` remains
  the administrator. The exact group and which trainers may confirm/reschedule/
  cancel still need the owner's answer. Do not grant rights to arbitrary members.
- Keep button-based navigation, not an AI/free-chat assistant. Booking still
  needs text entry for the existing name/age/comment fields.
- New users start in German regardless of Telegram's language. The separate
  `🌐 Sprache` menu offers DE/RU/UK/TR and preserves saved choices.
- Add a separate FAQ button using existing approved first-visit/location facts.
  Local code now includes free trial, equipment, first visit and location topics;
  FAQ navigation preserves a booking draft and works while booking is gated.
- Budget is zero. Use free services only; inexpensive paid options may be
  suggested later, never enabled or purchased without explicit approval.
- Tests still run only after implementation and operational setup are complete.

The German-default/FAQ changes are local and not in the published notice-stage
deployment. Their new/updated regression tests have not been executed.

### Revision and deployment pointers

- Working branch: `feature/telegram-native-care-2026-09-14` (Telegram WIP, PR #2).
- Last committed revision: `7e26fb432350c80b6789840734263d2b9c0109a9`.
- This continuation is **uncommitted local work on top of that revision**.
- Approved website remains `release-2`, code baseline
  `c8591e0aa1e197cdcc3eb850b174c6114467b595`; documentation head recorded by the
  canonical router is `5b8662da8176c04f90e033b8da6f3174e0e30fba`.
- No GitHub commit/push, remote handoff update, merge or Production deployment was
  performed. `operations/current-handoff.patch` prepares the canonical
  `Ak-loewen/index.md` update for a separately authorized GitHub publication.
- After the owner explicitly authorized use of a temporary Vercel credential,
  notice-stage Preview deployment `dpl_ZxsFBQT55SUqysjn3joQitYVmowQ` reached READY
  and replaced the previous deployment on the existing Preview alias. Only an
  explicit allowlist of `site/` deploy inputs was uploaded: no attachments,
  runtime state, env files, credentials, tests or Git metadata.
- That deployment still uses the pending booking gate. Local `src/data.js` now
  prepares the published version for a later activation deployment; it is not
  yet the source version deployed on the alias.

Open first: this file, `operations/telegram-preview-activation.md`, then
`site/server/bot-config.js`.

## Remaining work (not yet complete)

1. Obtain protected API access to the external scheduler (cron-job.org Console →
   Settings). Its credential is not configured in this Preview environment.
   Vercel access alone cannot configure that separate service. The user-provided
   Vercel key was said to last one hour; runtime auth was stored outside the
   repository in `/tmp/hoplite-vercel-auth`, never in deployed files. Reauthorize
   if it has expired. Never request secret values in ordinary chat.
2. Resolve the owner's intended trainer group and authorized staff members before
   changing routing. Until that explicit decision and authenticated numeric IDs
   are available, preserve the existing branch-only `TELEGRAM_STAFF_USER_IDS`,
   `TELEGRAM_STAFF_CHAT_ID`, webhook secret and Preview Redis configuration.
   Metadata confirms the staff values exist and are sensitive. Their numeric
   values were not disclosed or reassigned; prior authenticated binding from the
   owner's handoff remains the source. Do not authorize by username.
3. Inspect the scheduler for an existing matching job before creating one. If its
   worker secret is unavailable because Vercel stores it as write-only sensitive
   data, coordinate a new independent Preview-only worker secret and matching
   scheduler header; do not expose secrets through a diagnostic endpoint.
4. Finish runtime activation with `PRIVACY_PUBLICATION_STATUS=published`,
   `PRIVACY_CONSENT_VERSION=telegram-2026-09-15-v1` and the exact published
   `PRIVACY_URL`, scoped only to this Preview branch. Local source already uses
   that publication status/version. Preview runtime remains pending until this
   step; `FORM_DELIVERY_ENABLED=false` must remain unchanged.
5. Deploy the final activation revision, safely move only the existing Preview
   alias, and enable exactly one authenticated minute trigger. The prior
   notice-stage deployment is not proof of final bot activation.
6. **Only after all implementation/configuration is complete**, run the final
   relevant checks and one authorized Preview flow: booking → staff confirmation
   → optional reminder, including status and cancellation. No production activity.

## Verification in this continuation

No application tests, lint, browser checks or live Telegram flows were run, at the
owner's explicit request to defer testing until everything is ready. Vercel ran
the necessary notice-stage deployment build successfully. HTTPS publication was
confirmed with HTTP 200 and an exact document hash match; this is not bot-flow
verification. The later local activation source has not been built or tested.
Historical test results do not establish that this local revision passes.

Consent-version fixtures now use the source version. Three stale test button
expectations from the ZIP were aligned with the already-implemented send-without-
reminder choices and Russian program label, as described in the owner's original
START-HERE. These edits have not been executed as tests.

Do not enable the website form, change unrelated website content/navigation,
reset runtime data, register a production webhook, publish to GitHub or activate
Production without the relevant explicit authorization.
