# Project instructions — Release 2

## Start here

Before repository-wide search, read the canonical AI router on the documentation branch:

**https://github.com/koss32/Ak-loewen/blob/Ak-loewen/index.md**

Then read **`site/AI-MAP.md`** for exact file/function ownership and **`site/RELEASE-2.md`** for owner-approved Release 2 decisions.

- Canonical repository: `koss32/Ak-loewen`.
- Current approved implementation branch: **`release-2`**.
- Approved Release 2 code baseline: `c8591e0aa1e197cdcc3eb850b174c6114467b595`.
- Implementation: **`site/`**.
- Base: `codex/release-a` at `3e8cd4f7eeb272f6237d2fab49a9d99712fb836b`. Do not overwrite Release A.
- `codex/site-v1` is deprecated/historical. Never switch back to it for new work.
- Do not confuse Release 2 with historical v2 design concepts.
- Standalone preview: `concepts/ak-loewen-valset-release-2.html`; build from `site/`.

## Pending owner-requested change — VALSET navigation

This is a **planned next change, not yet implemented**.

On the opening/hero screen the user sees the two direction cards: **AK Löwen** and **VALSET**.

Required behavior for VALSET:

1. Clicking the VALSET direction/card on the opening screen should navigate/scroll to the dedicated **VALSET section** (`#valset`) instead of skipping directly to the booking form.
2. Inside the VALSET section, the **book / trial / “Записаться”** action should navigate/scroll to the trial form (`#probetraining`).
3. That VALSET booking action should keep/preselect VALSET in the form through the existing `data-direction="valset"` behavior.
4. Preserve normal anchor navigation, keyboard accessibility, reduced-motion behavior, locale switching, and mobile behavior.
5. Do not change unrelated AK Löwen navigation unless required for consistency.

Implementation routing: start with `site/src/render.js`, especially `DirectionEntry(...)`, `ValsetSection(...)` and links targeting `#probetraining`; only touch `site/public/client.js` if the existing anchor/data-direction handling needs adjustment. Current code already has `ValsetSection` booking links to `#probetraining` with `data-direction="valset"`; the main requested change is the hero/start-screen VALSET route.

## Identity and source of truth

- Legal/customer identity is **AK-LOEWEN gGmbH**; current presentation includes **VALSET**. Never substitute another company.
- The baseline specification `docs/TZ-AK-LOEWEN-gGmbH-v5-source-of-truth.md` on branch `Ak-loewen` remains authoritative for facts not superseded by owner-approved changes in `site/RELEASE-2.md`.
- Preserve original `references/`, `assets/` and historical concepts. They are not permission to replace current implementation.
- Keep four locales DE/RU/UK/TR.
- Approved AK palette: `#E85A22`, `#C4501E`, `#FF7A3D`; VALSET stays navy/blue/yellow. Do not substitute `#FE4123`.

## Content and behaviour

- Do not invent instructors, awards, experience, prices, schedules, contacts, legal text or testimonials.
- The U20 championship is owner-supplied and not independently verified.
- Keep the disclosure on the AI trainer illustration; Namig's approved real portrait remains separate.
- VALSET uses the same Telegram intake as AK. Instagram is optional, not a mandatory handoff.
- Preserve validation, consent, request-id handling, uncertain-delivery behavior, keyboard access, mobile composition and reduced-motion support.
- Do not expose secrets, send test leads, enable production delivery or deploy without explicit authorization.
- Historical verification does not validate later changes. Report exactly which checks actually ran.

## Efficient editing rule

Use `site/AI-MAP.md` before searching. Prefer symbol/selector-level search:

- factual data → `src/data.js`;
- user-facing copy → `src/locales.js` and specialized `*-copy.js` files;
- markup → named functions in `src/render.js`;
- browser behavior → named functions in `public/client.js`;
- styling → selectors/variables in `public/style.css`;
- hosted form delivery → `server/validate-request.js` → `server/hosted-trial.js` → `api/trial-requests.js`.

Do not inspect generated standalone HTML or vendor ScrollCraft internals unless the task explicitly requires them.

## Mandatory handoff after every repository-changing task

Before finishing work:

1. identify exact final branch and commit;
2. decide whether the branch is owner-approved/current or only WIP — never self-promote a feature branch;
3. update the `CURRENT HANDOFF` block in `Ak-loewen/index.md` with the approved pointer plus any WIP pointer;
4. update `site/AI-MAP.md` if modules, file ownership, endpoints, build/runtime paths or architecture changed;
5. tell the next agent exactly which branch/commit and 1–3 files to open first;
6. do not deploy or merge merely to simplify handoff.

A documentation-only commit on `release-2` does not by itself change the approved code baseline.