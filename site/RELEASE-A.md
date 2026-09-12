# Release A review candidate

Base: `d640c22c5f1d98f81925b5e7668fdb0b65da76c4`.
Backup: `backup/site-v1-d640c22-release-a`. Work branch: `codex/release-a`.

## Implemented

- Approved orange `#E85A22`, hover `#FF7A3D`, reserved light-theme token `#C4501E`. No new light theme was introduced.
- Stronger trial CTA and secondary brand choices; revised mobile glove placement without changing choreography or vendor files.
- Trainer section, horizontal prices, and form layout revised using existing copy and confirmed data.
- Schedule shows eight recurring schedule records directly, with brand, discipline and age-category filters, result count, empty state and group preselection.
- Telegram question dialog links to `https://t.me/ak_loewenbot?start=site_question`; Escape, backdrop closing, keyboard focus containment and return supported. No message is sent by opening it.
- Fixed stale `aria-current` on language switches; preserve form and schedule filters across all four locales.
- Header offset uses actual header height for responsive navigation.
- Confirmed entity name displayed as AK-LOEWEN gGmbH; removed only obsolete claims that its name is unknown.
- Existing marketing copy, confirmed schedules, pricing, ages, existing animation and historical concepts preserved. New translations are limited to new controls and status messages.

## Verification on 2026-09-12

- `npm test`: 11 passed.
- `npm run verify`: desktop, phone, compact, reduced motion, navigation, form, locale preservation and no-JavaScript behavior; 48 screenshots, no reported issues.
- `node tests/release-a.mjs`: DE/RU/UK/TR at 360, 390, 768, 1024 and 1440 pixels; overflow, filters, booking preselection, locale state, dialog keyboard behavior and eight legal routes passed.
- `node tests/mobile-locales.mjs`: no reported content overflow.
- `node tests/outcomes.mjs`: mocked delivery outcomes, safe retries, standalone assets/locales/legal dialogs, HTTP size/origin guards passed. No real Telegram delivery performed.
- `npm run build`: four localized pages, eight legal placeholder pages, standalone review file.
- Existing contact HTTPS links returned HTTP 200. The map redirects to an AK-LOEWEN gGmbH place. This does not establish mailbox delivery, account ownership or WhatsApp registration.
- No dedicated lint or typecheck is configured; JavaScript syntax is checked separately. Browser viewport tests do not certify physical devices, Safari, Firefox or screen-reader use.

Run browser tests after starting `npm run dev`; override the URL with `TEST_BASE_URL` if using another port.

## Outstanding before full functional acceptance

- A clear source portrait of Namig Aliyev is needed. Instagram supplied only a 100×100 avatar; no fictional likeness was generated or published. Confirm the discipline/role before assigning him to an existing trainer card.
- Owner-approved Impressum and Datenschutz are absent from both v5 files. Legal routes remain explicitly marked placeholders. Entity name confirmation is not approval of complete legal text.
- Rotate the token disclosed in chat as required by DOCX §5.4. Configure the replacement only in server secrets and identify the recipient chat. No token was added to this checkout.
- Vercel deployment is a static **review preview**, with form delivery disabled. The existing Node/SQLite delivery service is retained locally; its persistent local database is not a durable Vercel serverless store. Live deployment needs a suitable durable backend, recipient configuration, approved legal text and a verified delivery test.
- Broader DOCX items (Telegram webhook/admin roles/bootstrap, additional form fields and changed validation rules, root language negotiation) are not implemented in this visual candidate.
- DOCX requests renaming Senior, while current user instructions freeze existing text. Preserve the current name pending clarification.
- The MD v5 is a short implementation summary; the DOCX has additional functional requirements and older contradictory v2 instructions. Current direct user instructions and the v1 source-of-truth overrides govern this candidate.

Release B has not started. Production publication and Release A acceptance have not been claimed.
