# Repository instructions

## Mandatory first read

**Before searching or editing anything, read [`index.md`](index.md).** It is the canonical repository router and contains the live `CURRENT HANDOFF` pointer.

For deeper navigation use [`docs/AI-REPOSITORY-MAP.md`](docs/AI-REPOSITORY-MAP.md).

## Project identity

This repository is **koss32/Ak-loewen** for **AK-LOEWEN gGmbH × VALSET**. Do not repurpose it for another organization.

## Current routing

- documentation/default branch: `Ak-loewen`
- **current approved implementation branch: `release-2`**
- approved Release 2 code baseline: `c8591e0aa1e197cdcc3eb850b174c6114467b595`
- current code: `release-2/site/`
- implementation map: `release-2/site/AI-MAP.md`
- Release 2 handoff: `release-2/site/RELEASE-2.md`

`codex/site-v1` is **deprecated and historical**. Never select it for new implementation work. Release A and v2 concepts are also historical/reference material unless the owner explicitly requests comparison/recovery.

The baseline specification remains `docs/TZ-AK-LOEWEN-gGmbH-v5-source-of-truth.md` for facts not superseded by owner-approved Release 2 changes.

## Brand/data rules

- AK palette: `#E85A22`, `#C4501E`, `#FF7A3D`; do not use `#FE4123` as the required brand color.
- Preserve VALSET navy/blue/yellow identity.
- Do not invent schedules, prices, contacts, legal text, trainer identities, qualifications, achievements or testimonials.
- Preserve confirmed current data in `release-2/site/src/data.js` unless the owner supplies a change.
- Keep DE/RU/UK/TR aligned when user-facing content changes.

## Safety / delivery rules

- Keep secrets server-side; never commit tokens or credentials.
- Do not enable real form delivery, send test leads, configure production secrets/webhooks or deploy production without explicit owner approval.
- Do not present historical verification as proof for new changes. State exactly what was run.

## Mandatory handoff after work

Before ending any repository-changing task, update `index.md` on `Ak-loewen`:

- exact **current approved** branch + commit;
- exact WIP branch + commit if work is not approved;
- status (`APPROVED`, `WIP`, `DEPLOYED`, etc.) without guessing;
- 1–3 files the next agent should open first;
- concise remaining work.

Do **not** promote your own feature branch to current merely because you created or committed it. Only owner approval changes the approved pointer.

If architecture/file ownership changed, update the active branch's `site/AI-MAP.md` in the same handoff.