# OPUS 5 — Radical Landing Page Redesign Brief for AK-LOEWEN × VALSET

You are receiving a working, owner-approved baseline of the AK-LOEWEN gGmbH × VALSET project. The deliverable is specifically a **landing page**: one coherent, scrollable, conversion-focused landing experience, not a generic corporate website or a collection of unrelated pages. The current implementation is functional and should be treated as the factual/technical source of truth, not as a visual template.

## Priority / override

This is a NEW owner instruction. It explicitly supersedes older repository instructions that say to preserve the current composition, visual style, palette, section order, or existing motion design. Those visual-preservation constraints are now historical. Do NOT merely reskin Release 2 and do NOT try to stay visually close to it.

However, factual data, trainer identity, schedules, prices, contact details, legal status, booking behavior, accessibility, localization, and safety constraints in the project remain authoritative unless this brief explicitly changes them. Never invent missing facts.

## Goal

Rebuild the **landing page** as a genuinely new version. The main visitor journey should remain a single landing-page experience with anchor/section navigation or another coherent one-page interaction model. Legal/utility pages may remain separate where required, but the public-facing sports-club experience itself should not turn into a multipage corporate site. It may look and feel very different from the existing site — that is desirable. I want a fresh concept I would not get by simply polishing the current design. Reconsider information architecture, hero, navigation, rhythm, typography, visual language, interactions, schedule presentation, trainer presentation, transitions, motion, and the relationship between AK-LOEWEN and VALSET.

Do not copy the old composition. Do not preserve the old gloves animation just because it exists. ScrollCraft and the current CSS/section structure may be removed, replaced, or radically reinterpreted. The result should feel intentionally designed for this club, not like a generic AI-generated landing page.

Before implementation, inspect the project and internally explore at least three substantially different design directions. Choose the strongest one: the direction that is most distinctive from the current Release 2 while still being usable, credible, performant, and appropriate for parents, teenagers, and sports-club visitors. Implement ONE coherent direction rather than mixing several styles.

## Mandatory content and functionality to preserve

Use the files as source of truth, especially `site/src/data.js`, `site/src/locales.js`, the specialized `*-copy.js` files, `site/RELEASE-2.md`, and the existing form/server code.

Preserve these facts and capabilities:

- Organization: AK-LOEWEN gGmbH in Solingen, with VALSET as the second direction/brand experience.
- Main offerings: Boxen, Sambo & MMA, and VALSET acrobatics/circus groups.
- One trial visit is free.
- First visit messaging: no special equipment needs to be bought for the first training; comfortable sports clothing is enough; the trainer helps the newcomer settle in.
- Trainer imagery already in the project must remain available and be reused: Namig Aliyev's approved portrait assets (`namig-*`) and Anar Karimov's existing `coach.webp` illustration. Do not replace them with invented people. If the Anar illustration is shown, preserve the disclosure that it is an illustration, not a real portrait.
- Trainers: Namig Aliyev — Boxen. Anar Karimov — Sambo & MMA. The U20 world-champion claim for Anar is owner-supplied and not independently verified; do not embellish it with invented event/year/record.
- Four locales must remain: DE, RU, UK, TR.
- The full schedule must remain accurate, in Europe/Berlin local time:
  - Boxen 15+: Monday / Wednesday / Friday, 18:30–20:00.
  - Sambo & MMA 9–15: Tuesday / Thursday, 16:30–18:00; Saturday, 10:00–11:30.
  - Sambo & MMA 16+: Tuesday / Thursday, 18:30–20:00; Saturday, 12:00–13:30 by arrangement.
  - VALSET Mama & Kind 3–6: Monday / Wednesday / Friday, 15:00–16:00.
  - VALSET Junior 5–8: Monday / Wednesday / Friday, 16:00–17:00.
  - VALSET Senior 9–16: Monday / Wednesday / Friday, 17:00–18:00.
- Current monthly contributions from `site/src/data.js` must remain unless the source data is changed by the owner: Boxen €75, Sambo & MMA €60, VALSET €50.
- VALSET must remain a real, discoverable mode/direction, not a footnote. It may have a completely new visual language and interaction model, but visitors must understand it is acrobatics/circus for children and young people and be able to navigate from VALSET to the same trial-booking flow.
- Booking/trial form functionality must remain. AK and VALSET use the same Telegram intake. Instagram is optional, not a mandatory handoff. Preserve validation, consent, request-id/idempotency behavior, and uncertain-delivery safeguards unless you deliberately replace them with an equally safe implementation.
- Existing contact/business data must be taken from source files, not guessed. Current training address in source is `Werwolf 8, 42651 Solingen`; current email is `aklggmbh@gmail.com`.
- For verified company/legal facts, also use `docs/legal/LEGAL-DATA-SOURCES.md`.
- The current verified company facts are: registered business address `Parallelstraße 6, 42719 Solingen, Germany`; managing director `Dietrich Schmelzer`; register court `Amtsgericht Wuppertal`; commercial register `HRB 36478`; owner-supplied contact phone `+49 157 30447730`; no Datenschutzbeauftragter is appointed according to the owner. Do **not** confuse the registered business address with the training location at `Werwolf 8`.
- `docs/legal/impressum-draft.md` is the current Impressum draft. Preserve its draft status until the remaining tax-ID question is resolved.
- `docs/legal/telegram-privacy-draft.md` is the current unpublished Telegram-bot privacy draft. It is a working draft, not approved legal advice or a final published privacy notice.
- The unresolved legal identifiers are **USt-IdNr.** and **W-IdNr.**: no reliable public result was found. Never invent either number; they must be confirmed with bookkeeping/Steuerberater if they exist.

## What you are free to redesign completely

You may completely replace:

- page structure and section order;
- navigation model;
- hero concept;
- typography and spacing system;
- color system and theme behavior;
- cards, grids, accordions, filters, schedule UI;
- the AK/VALSET transition and dual-brand experience;
- animation and motion system;
- iconography and decorative language;
- trainer layout;
- pricing presentation;
- booking presentation and conversion flow, as long as the server-side data/behavior stays correct;
- CSS architecture and front-end component structure;
- current ScrollCraft usage;
- current glove visuals/animation;
- any visual convention that makes Release 2 recognizable.

The existing logos/brand names may be used as anchors, but do not let the old page dictate the new design.

## Color constraint from the owner

You are free to rethink the palette, but the current AK-LOEWEN orange must not disappear.

Treat the current approved AK orange `#E85A22` as a retained brand signal. It does **not** have to be the dominant color, but in at least one serious color direction/state it should account for roughly **20–30% of the visible color presence** (accents, interactive states, typography details, graphic elements, section transitions, etc.). The supporting orange tones already present in the project (`#C4501E`, `#FF7A3D`) may be used where useful.

Do not force orange onto every surface. It should feel intentional and recognizable rather than overwhelming. Other colors and the overall palette may change substantially.

## Design quality bar

Avoid a stereotypical AI landing page. Specifically avoid defaulting to endless rounded cards, random glassmorphism, neon gradients, decorative blobs, huge empty hero space, fake statistics, invented testimonials, gratuitous 3D, or scroll hijacking.

Aim for a distinctive sports/culture identity with strong art direction, clear hierarchy, excellent mobile behavior, and purposeful motion. Motion must support comprehension and brand character, not delay access to schedule/booking. Respect `prefers-reduced-motion`, keyboard navigation, focus states, semantic HTML, contrast, and readable type.

The landing page should work especially well for a parent who wants to answer three questions quickly: What is offered? When does it happen? How do I try it? At the same time, the first impression should be memorable enough that the club does not look like a generic local sports template.

## Technical expectations

First inspect the current architecture before changing it. Release 2 uses Node 24+, server-rendered/static build code, Vercel API handling, Upstash/Telegram delivery, and source data in `site/src/`.

You may keep the current stack or replace the front-end architecture if there is a strong reason, but do not break the booking backend or silently discard localization/data contracts. If you change architecture, document exactly what changed and make the project straightforward to run and build.

Do not edit generated standalone HTML as the primary source. Work from source files and regenerate output.

Keep the stable Release 2 baseline untouched. Create the redesign separately (for example a new branch such as `redesign/opus-5` or a clearly separate output directory). Do not merge, deploy to production, change secrets, enable live delivery, or send real test leads unless explicitly asked.

## Verification

After implementation:

1. run the relevant install/build/lint/test steps for the resulting architecture;
2. verify desktop and mobile layouts;
3. verify all four locales;
4. verify schedule facts and prices against the source data;
5. verify trainer images/status labels;
6. verify VALSET is clearly discoverable and reaches the trial flow;
7. verify form validation and non-live/safe behavior in preview;
8. verify keyboard navigation and reduced-motion behavior;
9. report exactly what was run and any checks that could not be completed.

## Deliverable

Do not stop at a design plan. Produce the redesigned, runnable **landing page** implementation.

At the end, give me:

- the chosen design concept in 5–10 concise bullets;
- a short explanation of how it intentionally differs from Release 2;
- the exact files/architecture changed;
- build/run instructions;
- verification results;
- any factual/content conflicts you discovered instead of guessing;
- a ready-to-review preview artifact or build output when possible.

The central instruction is simple: preserve the club's real information and working booking logic, but rethink the **landing page** itself from the ground up. I want a clearly different landing page, not Release 2 with new colors.
