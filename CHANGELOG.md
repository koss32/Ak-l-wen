# Version history

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
