# Parent-facing improvements to Release A

Base: `codex/release-a`, inspected source snapshot `3e8cd4f7eeb272f6237d2fab49a9d99712fb836b`.

## 1. Trainers

The owner's 2026-09-14 correction maps Namig Aliyev to boxing and Anar Karimov to Sambo & MMA. The owner supplied Anar's under-20 world championship claim; it was not independently verified. No competition, year, exact experience, qualification or additional award has been invented. Restored the original Anar illustration at the owner's request, retaining its disclosure that it is not a real trainer portrait; retained Namig's approved photograph. Added welcoming explanatory copy in all four languages.

## 2. First visit

Added a parent-facing section explaining that special equipment need not be purchased for the first visit, sportswear is enough, and the trainer welcomes and helps the child join the group. These statements follow the owner's instructions. Retained the existing one-free-visit offer.

## 3. Booking

VALSET now uses the existing server-side Telegram intake, including the same configured destination (`TELEGRAM_CHAT_ID_AK` in the hosted API). Instagram remains optional. Unified form uses a single contact-method selector; preferred time and comment are optional. Both server implementations share a readable Telegram message formatter. Sticky booking CTA points to the form rather than implying that direct bot messages are processed.

## 4. Photo and scroll motion

Restored the existing trainer illustration. Used the supplied ScrollCraft archive and Leonxlnx/taste-skill as design references, not additional dependencies. Added staggered section/card entrances, a distinct trainer reveal, light portrait depth and a reading-progress line in supported browsers. Existing glove/VALSET parallax, natural scrolling and form interactions remain intact. Removed duplicate legacy entrance controllers. Content stays visible without JavaScript, keyboard focus cancels nearby motion, reduced-motion disables decorative movement and mobile entrances use shorter distances without stagger delays.

## Delivery status

Changes are for review, not production deployment. Standalone HTML snapshots are explicitly preview-only and never submit personal data. No production configuration or secrets were accessed or changed; no real messages were sent and delivery was not verified. Existing tests and browser QA were not rerun at the owner's request, and historical tests were not updated. Existing legal-publication and hosting-configuration requirements remain unchanged. Production activation is a separate step requiring explicit approval.
