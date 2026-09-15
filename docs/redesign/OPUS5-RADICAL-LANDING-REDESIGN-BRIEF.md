# OPUS 5 — AK-LOEWEN × VALSET radical landing-page redesign

## Owner instruction and scope

This task is specifically to build a **landing page**: one coherent, scrollable, conversion-focused experience. It is not a generic multipage corporate website. Separate legal/utility pages may exist where required, but the main sports-club experience must remain a landing page.

This owner instruction supersedes older visual-preservation requirements for this redesign. Do **not** merely reskin Release 2. The new landing may differ strongly in composition, hero, navigation, typography, section order, motion, CSS architecture, schedule presentation, trainer presentation, and the AK-LOEWEN/VALSET relationship.

Factual data, trainer identity, schedules, prices, contacts, legal facts, localization, booking semantics, accessibility and safety constraints remain authoritative. Never invent missing facts.

Before implementation, internally explore at least three genuinely different directions and implement one coherent strongest direction.

## Sources of truth

Read these first:

- `site/src/data.js`
- `site/src/locales.js`
- `site/src/family-copy.js`
- `site/src/first-visit-copy.js`
- `site/src/booking-copy.js`
- `site/RELEASE-2.md`
- existing form/server backend
- `docs/legal/LEGAL-DATA-SOURCES.md`
- `docs/legal/impressum-draft.md`
- `docs/legal/telegram-privacy-draft.md`

If sources conflict, do not guess. Report the conflict and prefer explicit newer owner instruction.

## Mandatory content

Organization: **AK-LOEWEN gGmbH**, Solingen. VALSET remains a real second direction/brand, not a footer footnote.

Programs:

- Boxen
- Sambo & MMA
- VALSET acrobatics/circus for children and young people

Keep **one free trial visit**. Preserve first-visit meaning: no special equipment purchase is needed; comfortable sports clothing is enough; the trainer welcomes the newcomer, explains what to do and helps them settle into the group.

### Trainers and images

- Namig Aliyev — Boxen. Reuse approved `namig-*` portrait assets.
- Anar Karimov — Sambo & MMA. Reuse existing `coach.webp`; it is an illustration, not a real photo, and that must remain clear.
- The U20 world-champion claim for Anar is owner-supplied and not independently verified. Do not invent year, tournament, federation, record, experience or extra titles.
- Do not invent trainers or replace them with generated people.

### Schedule — Europe/Berlin

- Boxen 15+: Monday / Wednesday / Friday, 18:30–20:00.
- Sambo & MMA 9–15: Tuesday / Thursday, 16:30–18:00; Saturday, 10:00–11:30.
- Sambo & MMA 16+: Tuesday / Thursday, 18:30–20:00; Saturday, 12:00–13:30 by arrangement.
- VALSET Mama & Kind 3–6: Monday / Wednesday / Friday, 15:00–16:00.
- VALSET children 5–8: Monday / Wednesday / Friday, 16:00–17:00. Do not automatically relabel this group as “Junior”.
- VALSET older-children group 9–16: Monday / Wednesday / Friday, 17:00–18:00. Do not automatically relabel this group as “Senior”.

Do not invent additional sessions.

### Prices

Use current `site/src/data.js` values unless the owner changed them:

- Boxen: €75/month
- Sambo & MMA: €60/month
- VALSET: €50/month

Do not invent discounts, family tariffs or extra fees.

### Languages

Keep all four locales: **DE / RU / UK / TR**. Verify that text expansion does not break the landing.

## Legal/company facts

Use `docs/legal/LEGAL-DATA-SOURCES.md` before repeating public research.

Verified handoff facts:

- Company: **AK-LOEWEN gGmbH**
- Registered business address: **Parallelstraße 6, 42719 Solingen, Germany**
- Managing director: **Dietrich Schmelzer**
- Register court: **Amtsgericht Wuppertal**
- Commercial register: **HRB 36478**
- Email: **aklggmbh@gmail.com**
- Phone: **+49 157 30447730**
- No Datenschutzbeauftragter is appointed according to the owner.
- Training location: **Werwolf 8, 42651 Solingen**. Do not confuse it with the registered business address.

`docs/legal/impressum-draft.md` is a draft. `docs/legal/telegram-privacy-draft.md` is also a draft/unpublished working text, not approved legal advice.

**USt-IdNr.** and **W-IdNr.** remain unresolved: no reliable public result was found. Never invent them; confirm with bookkeeping/Steuerberater if they exist.

## Color constraint

The current AK-LOEWEN orange must remain visible.

Use the current approved orange **`#E85A22`** as a retained brand signal. It does not need to dominate, but in at least one serious color direction/state it should represent roughly **20–30% of visible color presence** through accents, typography details, interactive states, graphics, section transitions or similar deliberate use.

Supporting existing orange tones `#C4501E` and `#FF7A3D` may be used. Other colors and the wider palette may change radically.

## What may be redesigned

You may replace the current:

- hero and section order;
- navigation model;
- typography and spacing;
- cards/grids/accordions;
- schedule UI;
- pricing UI;
- trainer layout;
- AK/VALSET transition;
- motion system;
- glove animation;
- ScrollCraft usage;
- theme behavior;
- front-end component and CSS architecture.

Do not let Release 2 dictate the new composition.

## Quality bar

Avoid stereotypical AI-landing tropes: endless rounded cards, random glassmorphism, neon gradients, meaningless blobs, fake statistics, invented testimonials, gratuitous 3D, huge empty hero space, or scroll hijacking.

The landing must let a parent answer quickly:

1. What is offered?
2. When are the trainings?
3. How can we try it?

At the same time, it should have a distinctive sports/culture identity and feel intentionally designed for this club.

Motion is welcome but must not hide content or block normal scrolling. Support semantic HTML, keyboard navigation, visible focus states, adequate contrast, mobile UX and `prefers-reduced-motion`.

## Booking/backend

Keep the trial form working. AK-LOEWEN and VALSET use the same Telegram intake; Instagram is optional for VALSET, not a mandatory handoff.

Preserve validation, consent, request ID, idempotency/duplicate safeguards and uncertain-delivery behavior unless deliberately replaced with an equally safe implementation.

Do not send real test leads, expose secrets, enable production delivery, change production secrets, merge into the stable branch or deploy production without explicit owner authorization.

## Implementation safety

Stable Release 2 remains untouched as the approved baseline. Build the redesign separately, for example on `redesign/opus-5`.

Generated standalone HTML is not the source of truth. Work from source files and regenerate output.

## Verification

After implementation, actually run and report relevant checks:

1. install/build;
2. lint;
3. relevant tests;
4. desktop and mobile;
5. DE/RU/UK/TR;
6. schedule and prices;
7. trainer assets/disclosures;
8. VALSET discoverability and path to trial booking;
9. form safe/non-live behavior;
10. keyboard navigation;
11. reduced motion.

Do not claim checks that were not run.

## Deliverable

Do not stop at a plan or wireframe. Build the runnable landing page.

At the end provide:

- the selected concept in 5–10 concise points;
- why it is substantially different from Release 2;
- changed files/architecture;
- run/build instructions;
- verification results;
- factual conflicts found instead of guessed;
- a reviewable preview/build artifact when possible.

Core principle: **preserve real club data and working booking logic, but rethink the landing page almost from scratch.**
