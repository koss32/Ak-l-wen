# Version history

## 2026-09-12 — v3, stage 0: recovery for approval

- Preserved v2, references, assets and the archived update script byte-for-byte.
- Added a deterministic UTF-8 recovery script that runs the archived generator in isolation and refuses to overwrite later v3 edits.
- Added a self-contained recovered preview with a script-hash CSP, blocked network/form submissions and noindex metadata.
- Verified HTML structure, embedded images, JS syntax, Edge desktop/mobile layout and baseline interactions. Full evidence and outstanding requirements: `docs/v3-stage-0-review.md`.
- Functional fixes, live submissions, legal completion and animations remain separate parts awaiting user approval.

## 2026-09-11 — Follow-up review

- Confirmed the GitHub connection uses `koss32` and the canonical project branch is `ak-lowen`.
- Matched all nine existing local project files against the GitHub blob hashes at commit `3f2d2f79cb5215fe7d7f74f25611865704056432`.
- Confirmed the uploaded original HTML and VALSET image match the archived project inputs byte-for-byte.
- Fixed the VALSET price amount to use the yellow brand color in both themes. Previously it inherited the dark text color in the light theme while the card retained its blue background.
- Preserved the reproduction script, original assets, and the repository instructions for future work.
- Visual browser review remains unavailable: the browser rejected the local HTTP preview with `ERR_BLOCKED_BY_CLIENT`. No browser rendering or interaction pass is claimed.

## 2026-09-11 — Concept v2: AK LÖWEN × VALSET

User request: preserve the existing concept, add VALSET (previously `[Richtung B]`) at the top and bottom, use blue/yellow for VALSET, and retain AK Löwen's `#F0401F` accent. Save all project files and versions in `koss32/Ak-l-wen`.

### Changes

- Added VALSET Circus Studio beside AK Löwen in the header and to desktop/mobile navigation.
- Replaced the hero's second-direction placeholder with a blue/yellow VALSET card, the supplied image, and a working section link.
- Added a VALSET section after the existing AK Löwen about section, including the supplied artwork and links to the demo form and contact block.
- Added a dedicated VALSET brand block and links in the footer.
- Updated existing direction placeholders in prices, contacts, and the demo form; VALSET's trial button preselects the corresponding option.
- Applied `#F0401F` to AK Löwen's main accent in dark and light themes.
- Added responsive styles for both brand identities and the new section; adjusted the header/banner spacing and mobile menu for the extra entry.
- Added mobile menu Escape handling, focus handling, `inert`, and reduced-motion CSS support.
- Preserved the input HTML and the input VALSET image byte-for-byte; extracted both existing AK Löwen logos without regenerating them.

### Validation

- Parsed the final HTML and checked unique IDs, all non-placeholder internal links, VALSET navigation/footer references, form preselection targets, and embedded images.
- Verified that both main theme accents are exactly `#F0401F` and that the previous `[Richtung B]` text is absent.
- JavaScript syntax check passed using `node --check`.
- Browser rendering was not verified: the browser security policy rejected navigation to the local HTML file. Responsive appearance and interactive behavior require a visual browser review.
- Existing placeholder legal links (`href="#"`) and provisional content remain unchanged in scope. The form remains a local demonstration and sends nothing.
