# Verification · website v1

Verified locally on 12 September 2026 in headless installed Chrome, Node 24.21.0. No production deployment or real Telegram delivery was performed.

## Results

- Eleven Node tests passed: exact age boundaries, form/server validation, consent, allowed disciplines, disabled integration, acknowledged delivery, concurrent duplicate protection, replay after success, request conflicts, retry after explicit Telegram refusal, persistent uncertainty across restarts, rate limiting, complete locale keys and schedule references.
- Browser layout checks passed at 1440×1000, 390×844, 360×640 and 1440×1000 with reduced motion. 48 screenshots cover opening, intermediate glove positions, hero exit and all content sections. No page errors, failed images or horizontal overflow in these checks.
- Additional 360×640 checks cover Russian, Ukrainian and Turkish opening, prices, form and both VALSET regions. 15 screenshots. Long Cyrillic headings initially overflowed; adjusted locale-aware type sizing and minimum grid sizes. The repeat reported zero overflowing elements.
- Verified direct discipline anchors, only one discipline open, closed details excluded from focus, native no-JavaScript disclosures, mobile menu and Escape focus return.
- Verified group preselection, age correction without data loss, all four language switches with populated fields and consent, demo validation with zero POST requests, and VALSET’s separate Instagram path with no personal fields.
- Mocked browser responses verified sending/disabled state, successful delivery feedback after a language switch, uncertainty with the same request ID on retry, and error data retention. These prove UI behavior, not real Telegram connectivity. Inputs remain locked while an uncertain request is being resolved; confirmed success cannot resubmit the same form.
- HTTP tests verified oversized request rejection and cross-origin rejection.
- Standalone package tested from file://: scripts, images, language switching and legal placeholder dialogs. A build-time replacement-string issue initially collapsed `$$` to `$`; fixed with function replacers, rebuilt and verified the final output.
- `npm audit`: zero vulnerabilities after upgrading the development-only image utility.

## Scroll-craft evidence

Used the real unmodified ScrollCraft JS/CSS engine and MIT license, plus project-specific glove choreography. Ran the skill’s `shoot.mjs` harness on desktop, phone and reduced motion: 25 / 27 / 25 samples, all settled, final results report no dead scroll.

The first harness pass flagged the settled decorative gloves during ordinary page reading. The rendered page was still moving in natural document flow. The fixed decorative layer now explicitly reports its genuine resolved hold after the hero and when reduced motion is selected. This annotation describes the existing scene; it does not invent animation to hide a failure.

FFmpeg is unavailable. No video is used. Harness PNGs were captured normally; the contact sheet was composed using Sharp instead of the optional FFmpeg tile step. Desktop, mobile, trainer and VALSET frames were visually inspected. The harness has no cue-text contrast measurements for this natural-flow implementation; do not interpret its output as an automated accessibility certification.

The intended visual progression is recognition → choice → trust → clarity → commitment → orientation → possibility. Visual inspection showed a strong opening, readable practical sections and a distinct VALSET ending. The main correction was smaller Cyrillic headings on compact phones. The gloves carry the opening motion peak; practical sections remain calm and unpinned, preserving the approved v2 architecture. No pointer-lock/capture is used; automated contexts disable both APIs.

## Limits

- Real iPhone/Android hardware, assistive-technology review and human translation review are still outstanding. Headless mobile viewports are not physical-device testing.
- Real Telegram credentials and recipient chat were not provided. No messages were sent. Production delivery must be verified after configuration and approved legal text.
- Legal pages are explicit placeholders. The identity/achievements of the second trainer remain pending. No invented titles or testimonials were added.
- The repository and local preview are the deliverables. There is no public website deployment from this task.

Reproduce: `npm test`, `npm run verify`, `node tests/mobile-locales.mjs`, `npm run build`, `node tests/outcomes.mjs`. Start the local server first for browser/HTTP tests. Runtime reports and raw screenshots are generated under ignored `test-results/`; selected review images are in `evidence/`.
