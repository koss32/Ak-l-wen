# Project instructions — Release 2

## Start here

- Canonical repository: `koss32/Ak-loewen`.
- This approved version lives on **`release-2`**, with implementation in **`site/`**.
- Read **`site/RELEASE-2.md`** before making changes. It records the owner's approved changes, source facts, delivery status and limitations.
- Base: `codex/release-a` at `3e8cd4f7eeb272f6237d2fab49a9d99712fb836b`. Do not overwrite Release A.
- Do not confuse Release 2 with historical v2 design concepts or switch back to `codex/site-v1` merely because an older document names it.
- Standalone preview: `concepts/ak-loewen-valset-release-2.html`; build: `cd site && node build.js`.

## Identity and source of truth

- Legal/customer identity is **AK-LOEWEN gGmbH**. Never substitute another company.
- The existing `docs/TZ-AK-LOEWEN-gGmbH-v5-source-of-truth.md` on branch `Ak-loewen` remains the baseline specification, except for owner-approved changes explicitly recorded in `site/RELEASE-2.md`.
- Preserve original `references/`, `assets/` and historical concepts. They are not permission to replace the current implementation.
- Keep four locales DE/RU/UK/TR and the approved visual system: `#E85A22`, light-theme `#C4501E`, lighter accent `#FF7A3D`; VALSET remains navy/blue/yellow. Do not substitute `#FE4123`.

## Content and behaviour

- Do not invent instructors, awards, experience, prices, schedules, contacts, legal text or testimonials. The U20 championship is owner-supplied, not independently verified.
- Keep the disclosure on the restored AI trainer illustration; Namig's approved real portrait remains separate.
- VALSET now uses the same Telegram intake as AK. Instagram is optional, not a mandatory handoff. Do not restore the old Instagram-only flow.
- Preserve validation, consent, request-id handling, uncertain-delivery behaviour, keyboard access, mobile composition and reduced-motion support.
- Do not expose secrets, send test leads, enable production delivery or deploy without explicit authorization.
- Existing verification documents/tests are historical. Tests and browser QA were not rerun for this revision at the owner's request. Never claim prior results validate new changes. If asked to verify or prepare deployment, update coverage for the new flow and report exactly what ran.
- Work in reviewable parts and report exact branch/commit. An isolated branch is not itself a published GitHub Release or a production deployment.
