# AK-LOEWEN gGmbH website specification

## Binding source of truth

This project is exclusively for **AK-LOEWEN gGmbH**. It is not a reusable template or a project for another company.

The only implementation baseline for future work is:

- repository: `koss32/Ak-l-wen`
- branch: `ak-lowen`
- baseline commit: `d640c22c5f1d98f81925b5e7668fdb0b65da76c4`
- implementation: `site/`
- standalone preview: `concepts/ak-loewen-valset-site-v1.html`

The old `concepts/ak-loewen-valset-konzept-v2.html` is historical material only. Do not repair it, copy from it, or use it as the implementation baseline.

## Color system

Use the orange shown in the current approved visual file:

- primary AK Löwen orange: `#E85A22`
- light-theme orange: `#C4501E`
- lighter accent: `#FF7A3D`

Do not use `#FE4123` as the project's required brand color. Do not replace the current orange with a different red-orange without explicit approval.

## Required work

Improve the existing v1 visually and functionally without replacing its approved visual language:

- preserve the dark AK Löwen system, the orange palette above, the blue/yellow VALSET system, angular cards, two brand entrances and animated boxing gloves;
- improve hero hierarchy and the primary free-trial CTA;
- reduce repetitive card grids through varied information blocks and visual pauses;
- strengthen trainer trust without inventing identities, biographies, achievements or images;
- improve scanning of schedule, prices and the trial form;
- check mobile hero composition, glove placement, headings, CTA readability and horizontal overflow;
- keep confirmed data from `site/src/data.js` authoritative;
- keep four locales and existing accessibility and security behavior.

No new large animation scenes may be added until the visual pass is approved. ScrollCraft and the current glove choreography must not be removed or replaced without explicit approval.

## Delivery protocol

Work in reviewed parts. Before each material decision, ask targeted clarification questions if the answer can change the result. After each part, provide a preview and wait for approval where the specification requires it.

Create a backup branch or tag from the baseline commit before editing. Use clear commits and provide a changelog and visual preview. Never publish production without approval.

## Release order

1. Release A: visual and functional improvements, content, locales, navigation, forms, legal pages, responsive behavior and QA.
2. Release B: scroll motion and microinteractions, only after written approval of Release A.

Do not invent schedules, prices, contacts, legal data, trainer facts or VALSET age criteria. Keep unresolved data explicitly pending.

## Existing implementation map

- `site/src/data.js`: confirmed project data
- `site/src/locales.js`: DE/RU/UK/TR translations
- `site/src/render.js`: server-rendered pages
- `site/public/style.css`: visual system
- `site/public/client.js`: interactions and motion
- `site/public/vendor/`: ScrollCraft engine

The website is for AK-LOEWEN gGmbH only. Any reference to v2 means historical context, never the working source.
