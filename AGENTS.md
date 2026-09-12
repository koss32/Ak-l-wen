# Repository instructions

## Project identity

This repository contains the website for **AK-LOEWEN gGmbH only**. Do not generalize it into a template or repurpose it for another organization.

## Implementation source

Use only baseline commit `d640c22c5f1d98f81925b5e7668fdb0b65da76c4` on branch `ak-lowen`, including `site/` and `concepts/ak-loewen-valset-site-v1.html`.

The old `concepts/ak-loewen-valset-konzept-v2.html` is historical and must not be used as the implementation source.

## Working rules

- Preserve confirmed data in `site/src/data.js`.
- Do not invent schedules, prices, contacts, legal text, trainer identities, qualifications or achievements.
- Preserve the approved AK Löwen / VALSET visual systems and current ScrollCraft animation unless a separate approval authorizes a change.
- Work in reviewed parts and show previews after material stages.
- Ask focused clarification questions when missing information can change the result.
- Keep secrets server-side and never commit tokens or personal credentials.
- Run relevant tests and browser checks before handing off changes.
- Do not deploy production without explicit user approval.
