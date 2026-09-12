# Project instructions

## Canonical identity

- Canonical repository: `koss32/Ak-loewen`.
- Repository/default documentation branch: `Ak-loewen`.
- Website implementation branch: `codex/site-v1`.
- Implementation baseline: commit `d640c22c5f1d98f81925b5e7668fdb0b65da76c4`.
- The legal/customer identity is specifically **AK-LOEWEN gGmbH**. Do not rename it to another organisation or invent a different company.
- The binding source of truth is `docs/TZ-AK-LOEWEN-gGmbH-v5-source-of-truth.md` and its DOCX counterpart on branch `Ak-loewen`. Implementation work is made on `codex/site-v1`.

## Working rules

- The current website source is under `site/` on `codex/site-v1`. The standalone preview is `concepts/ak-loewen-valset-site-v1.html` on the same branch.
- The old v2 concept is historical reference material only. Do not treat it as the current implementation or current instruction set.
- Preserve original material under `references/` and `assets/`; do not silently overwrite historical source files.
- The visual system uses the orange from the approved website concept:
  - primary dark-theme AK Löwen orange: `#E85A22`
  - light-theme orange: `#C4501E`
  - lighter orange accent: `#FF7A3D`
  - VALSET remains a separate navy/blue/yellow identity.
- Do not replace the approved orange with `#FE4123`. Do not describe the brand colour only as “orange”; use the exact values above where a value is required.
- Do not invent instructors, achievements, prices, schedules, contacts, legal text or testimonials. Keep unresolved items explicitly marked as pending.
- Do not deploy production unless the user explicitly requests it. Validate locally with the project scripts and preserve accessibility, reduced-motion and mobile behaviour.
- Before changing architecture, content, palette, animation or forms, check the source-of-truth document and the current implementation branch. Work in reviewable parts and report the exact commit and branch.

