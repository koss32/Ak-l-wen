# Release 3 — Telegram bot continuation

## Canonical project state

- **Release 2** — approved website baseline. Do not modify it as part of Telegram rollout work.
- **Release 3** — current Telegram-bot WIP/Preview state.
- **Canonical working branch:** `release-3`.
- Production has not been activated for the Telegram bot.
- Final tests/lint/build and a live Preview Telegram flow are still pending.

Use release names in normal project communication. Commit SHAs and legacy branch names are retained only as technical Git history.

## Current state

The owner confirmed the updated Telegram privacy content on 2026-09-15. This records owner approval of the supplied content; it is not an independent legal review.

- Controller: AK-LOEWEN gGmbH, represented by Dietrich Schmelzer.
- Registered address: Parallelstraße 6, 42719 Solingen.
- Contact: aklggmbh@gmail.com, +49 157 30447730.
- Register: Amtsgericht Wuppertal, HRB 36478.
- Training address: Werwolf 8, 42651 Solingen.
- Published Preview notice: `https://ak-loewen-bot-preview.vercel.app/telegram-privacy/`.
- Privacy version: `telegram-2026-09-15-v1`.

Release 3 already contains DE/RU/UK/TR dialogs, German as the default first language, button navigation, FAQ, booking flow, optional two-hour reminders, staff actions, protected webhook/worker logic, storage and runtime validation.

## Owner decisions carried into Release 3

- Goal: open real client booking only after final verification.
- Requests should be handled in a Telegram group with trainers; `@koss320` remains the administrator.
- Exact trainer group and authorized staff still need to be bound before activation.
- Keep button-based navigation rather than an AI/free-chat assistant.
- New users start in German; DE/RU/UK/TR remain selectable through `🌐 Sprache`.
- FAQ uses approved first-visit/location information.
- Budget is zero; use free services unless a paid option is separately approved.
- Final tests run only after implementation and operational configuration are complete.

## Completed in Release 3

- Current Telegram source and tests restored and preserved.
- German-default navigation and FAQ changes prepared.
- Preview privacy notice published and verified over HTTPS.
- `site/server/telegram-staff.js` added for current group-membership validation via Telegram `getChatMember`.
- Preview activation documentation prepared.
- Current work is published to GitHub under `release-3`.

## Remaining work before Release 3 can be considered complete

1. Add `@ak_loewenbot` to the intended trainer group with the minimum admin rights required for reliable membership checks.
2. Bind the actual numeric group chat ID and confirm which trainers may confirm/reschedule/cancel requests.
3. Integrate `site/server/telegram-staff.js` into the staff action handler so authorization depends on the intended group and approved staff policy.
4. Inspect/configure the external scheduler and create or reuse exactly one authenticated minute trigger for the Preview worker.
5. Complete Preview runtime activation using the published privacy version and URL while leaving the unrelated website form disabled.
6. Deploy the final Preview activation state.
7. Run the final relevant tests/lint/build.
8. Run one authorized Preview flow: booking → staff confirmation → optional reminder → status/cancellation.
9. Only after successful verification make a separate decision about Production activation.

## Safety boundary

Do not activate Production, enable the unrelated website form, reset runtime data, expose secrets, or authorize staff by username alone as part of Release 3 completion.

## Read next

1. `RELEASE-3.md`
2. `operations/telegram-preview-activation.md`
3. `site/server/bot-config.js`

## Technical history

Legacy feature branches and commit SHAs remain in Git for traceability. They are not the project version names. The current human-readable version name is **Release 3** and the canonical branch is `release-3`.
