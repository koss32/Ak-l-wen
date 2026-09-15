from pathlib import Path
import base64
import re

root = Path(__file__).resolve().parents[1]
s = (root / 'references/ak-loewen-konzept-ZWISCHENSTAND.html').read_text()
valset_image = 'data:image/jpeg;base64,' + base64.b64encode((root / 'assets/valset-original.jpg').read_bytes()).decode()

def replace(old, new, count=None):
    global s
    assert old in s, f'Missing replacement: {old[:100]}'
    s = s.replace(old, new, count if count is not None else -1)

replace('AK LÖWEN — Design-Konzept (Astra 6)', 'AK LÖWEN × VALSET — Design-Konzept v2')
for old in ['#E85A22', '#C4501E']:
    replace(old, '#F0401F')
replace('#FF7A3D', '#FF6547')
replace('#A63F16', '#D83416')
replace('--accent-ink: #17110C', '--accent-ink: #100C09')
replace('--accent-ink: #FFFFFF', '--accent-ink: #100C09')
replace('rgba(232,90,34,.14)', 'rgba(240,64,31,.14)')
replace('rgba(232,90,34,.28)', 'rgba(240,64,31,.28)')
replace('rgba(196,80,30,.10)', 'rgba(240,64,31,.10)')
replace('rgba(196,80,30,.20)', 'rgba(240,64,31,.20)')
replace('/* Richtung B — eigenständiges Akzentsystem (Platzhalter) */', '/* VALSET Circus Studio — Richtung B: blue and yellow */')
replace('--b-bg: #0E1B2C', '--b-bg: #071E38')
replace('--b-surface: #142A42', '--b-surface: #103F73')
replace('--b-accent: #F1B93B', '--b-accent: #F4CC46')
replace('rgba(241,185,59,.5)', 'rgba(244,204,70,.5)')

# Add both identities to the persistent header without replacing the original AK logo.
replace('  <div class="wrap nav">\n    <a href="#start" class="brand">', '  <div class="wrap nav">\n    <div class="brand-family">\n    <a href="#start" class="brand">', 1)
replace('    </a>\n    <ul class="nav-links">', '''    </a>
    <a href="#valset" class="valset-wordmark" aria-label="VALSET Circus Studio — Bereich ansehen"><strong>VALSET</strong><small>CIRCUS STUDIO</small></a>
    </div>
    <ul class="nav-links">''', 1)
replace('<li><a href="#ak-loewen">AK Löwen</a></li>', '<li><a href="#ak-loewen">AK Löwen</a></li>\n      <li><a href="#valset" class="valset-nav">VALSET</a></li>')

replace('''      <div class="entry-card b">
        <div class="tag">BEREICH 02</div>
        <h3>[Richtung B]</h3>
        <p>Eigenständiges Angebot derselben Organisation. Name, Logo und Inhalte folgen nach Bestätigung.</p>
        <div class="row-bottom">
          <span class="badge-soon">In Vorbereitung</span>
        </div>
      </div>''', f'''      <div class="entry-card b">
        <div class="valset-entry-top">
          <div><div class="tag">BEREICH 02 · CIRCUS STUDIO</div><h3>VALSET</h3><p>Raum für Bewegung.<br>Platz für Fantasie.</p></div>
          <div class="valset-entry-mark"><img src="{valset_image}" alt="VALSET: Löwe und Artistin im Ring" width="720" height="1280"></div>
        </div>
        <div class="row-bottom"><a href="#valset" class="tlink">VALSET entdecken <span aria-hidden="true">↗</span></a><span class="valset-small">Circus Studio</span></div>
      </div>''')

replace('[Richtung B]', 'VALSET')
replace('Name und Struktur folgen.', 'Circus Studio · Gruppeneinteilung folgt.')
replace('<option value="richtung-b">VALSET</option>', '<option value="valset">VALSET — Circus Studio</option>')
replace('<div class="kontakt-col b">', '<div class="kontakt-col b" id="valset-kontakt">')
replace('>VALSET</h4>', '>VALSET <span class="valset-small">Circus Studio</span></h4>')
replace('<p class="mt-16" style="font-size:13px; color:var(--ink-3)">Telegram', '<p class="mt-16" style="font-size:13px; color:var(--b-ink)">Telegram')

# Second direction near the end of the concept, alongside the existing AK about section.
replace('</main>', f'''<!-- ================= VALSET / RICHTUNG B ================= -->
<section class="blk valset-section" id="valset" aria-labelledby="valset-title">
  <div class="wrap">
    <div class="valset-section-top"><span>BEREICH 02</span><span>VALSET · CIRCUS STUDIO</span></div>
    <div class="valset-grid">
      <div class="valset-copy">
        <div class="eyebrow">Bewegung trifft Fantasie</div>
        <h2 id="valset-title">Eine andere Art,<br><em>über sich<br>hinauszuwachsen.</em></h2>
        <p class="lead mt-24">Willkommen bei VALSET Circus Studio.</p>
        <p class="mt-16">Neben dem Kampfsport von AK Löwen bekommt VALSET seinen eigenen Raum — mit einer eigenen Identität und der Freude an Bewegung im Mittelpunkt.</p>
        <div class="valset-actions"><a href="#probetraining" class="btn valset-btn" data-preselect="valset">Probetraining anfragen <span aria-hidden="true">↗</span></a><a href="#valset-kontakt" class="tlink">Kontakt</a></div>
        <p class="valset-pending">Kurse, Altersgruppen und Trainingszeiten werden noch ergänzt.</p>
      </div>
      <figure class="valset-visual">
        <div class="valset-art"><img src="{valset_image}" alt="VALSET Circus Studio: goldener Löwe und Artistin im Ring auf blauem Hintergrund" width="720" height="1280" loading="lazy"></div>
        <figcaption><span>VALSET</span><span>CIRCUS STUDIO</span></figcaption>
      </figure>
    </div>
  </div>
</section>

</main>''', 1)

# A complete second brand block in the footer.
replace('''      <div>
        <h5>Kampfsport</h5>''', f'''      <div class="foot-valset">
        <a class="foot-brand" href="#valset"><span class="foot-valset-mark"><img src="{valset_image}" alt="" width="720" height="1280" loading="lazy"></span><span>VALSET<small>CIRCUS STUDIO</small></span></a>
        <p>Raum für Bewegung. Platz für Fantasie.</p>
        <a href="#valset" class="tlink mt-16">Studio entdecken <span aria-hidden="true">↗</span></a>
      </div>
      <div>
        <h5>Kampfsport</h5>''', 1)
replace('© 2026 AK LÖWEN — gemeinsame Rechtsform mit VALSET', '© 2026 AK LÖWEN × VALSET Circus Studio')
replace('Konzeptstand 10.09.2026', 'Konzeptstand 11.09.2026 · Version 2')
replace('Design-Konzept — Astra 6', 'Design-Konzept · AK LÖWEN × VALSET')

# Small layout fixes are necessary for the added header and mobile menu entry.
replace('<div class="mmenu">', '<div class="mmenu" id="mobile-menu" aria-hidden="true" inert>')
replace('data-open-menu aria-label="Menü öffnen"', 'data-open-menu aria-label="Menü öffnen" aria-controls="mobile-menu" aria-expanded="false"')
replace("  document.querySelectorAll('[data-open-menu]').forEach(function(b){\n    b.addEventListener('click', function(){ mmenu.classList.add('open'); });\n  });\n  document.querySelectorAll('[data-close-menu]').forEach(function(b){\n    b.addEventListener('click', function(){ mmenu.classList.remove('open'); });\n  });\n  mmenu.querySelectorAll('a').forEach(function(a){\n    a.addEventListener('click', function(){ mmenu.classList.remove('open'); });\n  });", """  var menuOpener = document.querySelector('[data-open-menu]');
  function setMenu(open){
    mmenu.classList.toggle('open', open);
    mmenu.inert = !open;
    mmenu.setAttribute('aria-hidden', String(!open));
    menuOpener.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if(open) mmenu.querySelector('[data-close-menu]').focus();
    else menuOpener.focus();
  }
  menuOpener.addEventListener('click', function(){ setMenu(true); });
  document.querySelectorAll('[data-close-menu]').forEach(function(b){
    b.addEventListener('click', function(){ setMenu(false); });
  });
  mmenu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ setMenu(false); });
  });
  document.addEventListener('keydown', function(e){
    if(!mmenu.classList.contains('open')) return;
    if(e.key === 'Escape') setMenu(false);
    if(e.key === 'Tab'){
      var items = Array.from(mmenu.querySelectorAll('a,button')).filter(function(el){return el.offsetParent !== null;});
      var first = items[0], last = items[items.length - 1];
      if(e.shiftKey && document.activeElement === first){e.preventDefault();last.focus();}
      else if(!e.shiftKey && document.activeElement === last){e.preventDefault();first.focus();}
    }
  });""")

css = '''
/* ---------- Version 2: AK LÖWEN × VALSET ---------- */
section[id], #valset-kontakt{scroll-margin-top:108px}
header{background:color-mix(in srgb, var(--bg) 96%, transparent);border-color:var(--line)}
.topbar{margin-top:76px;position:relative;font-size:11px;padding:7px var(--pad)}
.hero{min-height:calc(100svh - 114px);padding-top:70px}
.brand-family{display:flex;align-items:center;gap:20px;flex-shrink:0}
.valset-wordmark{padding-left:20px;border-left:1px solid var(--line-strong);display:flex;flex-direction:column;line-height:1.1;color:var(--b-accent)}
.valset-wordmark strong{font-family:Georgia,serif;font-weight:400;letter-spacing:.04em;font-size:24px}
.valset-wordmark small{font-size:8px;letter-spacing:.19em;margin-top:5px;color:var(--ink-2)}
html[data-theme="light"] .valset-wordmark{color:var(--b-surface)}
.nav-links{gap:18px}
.nav-links .valset-nav{color:var(--b-accent)}
html[data-theme="light"] .nav-links .valset-nav{color:var(--b-surface)}
.nav-links .valset-nav.active::after{background:var(--b-accent)}
.mmenu .valset-nav{color:var(--b-accent)}
html[data-theme="light"] .mmenu .valset-nav{color:var(--b-surface)}
.mmenu{overflow-y:auto;visibility:hidden}
.mmenu.open{visibility:visible}
.mmenu ul{margin-top:14px}
.mmenu li a{display:block;padding:10px 0;font-size:27px}
.mmenu-foot{padding-top:24px}
.entry-card.b{border:1px solid rgba(244,204,70,.4);background:linear-gradient(120deg,var(--b-bg),var(--b-surface));}
.entry-card.b:hover{border-color:var(--b-accent)}
.entry-card.b h3{font:400 36px/1.1 Georgia,serif;letter-spacing:.04em;margin-top:12px;color:var(--b-accent)}
.entry-card.b .row-bottom{border-top:1px solid rgba(244,204,70,.2);padding-top:16px;margin-top:18px;gap:12px}
.entry-card.b .tlink,.valset-section .tlink,.foot-valset .tlink{border-color:var(--b-accent);color:var(--b-ink)}
.valset-entry-top{display:grid;grid-template-columns:1fr 116px;gap:12px;align-items:center}
.valset-entry-mark{aspect-ratio:1;border:1px solid rgba(244,204,70,.25);overflow:hidden}
.valset-entry-mark img{width:100%;height:100%;object-fit:cover}
.valset-small{font-size:11px;font-weight:400;letter-spacing:.03em;color:#BED0E0;white-space:nowrap}
.kontakt-col.b{background:linear-gradient(120deg,var(--b-bg),var(--b-surface));border:1px solid rgba(244,204,70,.35)}
.kontakt-col.b .ph{color:var(--b-accent);border-color:rgba(244,204,70,.5)}
.kontakt-col.b .kontakt-row{border-color:rgba(244,204,70,.2)}
.price-card.b-variant{background:var(--b-bg);border-color:rgba(244,204,70,.35)}
.price-card.b-variant .amount{color:var(--b-accent)}
.price-card.b-variant h4,.price-card.b-variant p,.price-card.b-variant .amount small{color:var(--b-ink)}
.price-card.b-variant .ph{color:var(--b-accent);border-color:var(--b-accent);background:rgba(244,204,70,.08)}
.valset-section{background:linear-gradient(115deg,#061A30 0%,#0A2D54 65%,#103F73 100%);color:var(--b-ink);overflow:hidden;border-top:3px solid var(--b-accent)}
.valset-section-top{display:flex;justify-content:space-between;gap:18px;border-bottom:1px solid rgba(244,204,70,.22);padding-bottom:20px;margin-bottom:44px;color:#BED0E0;font-size:11px;letter-spacing:.14em}
.valset-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:64px;align-items:center}
.valset-copy .eyebrow{color:var(--b-accent);font-size:12px}
.valset-copy h2{color:var(--b-ink);font-size:clamp(34px,4.1vw,58px);line-height:1.04}
.valset-copy h2 em{color:var(--b-accent);font-style:normal}
.valset-copy p{color:#BED0E0;font-size:14px;max-width:48ch}
.valset-copy p.lead{font-size:18px;color:var(--b-ink)}
.valset-actions{display:flex;align-items:center;gap:24px;flex-wrap:wrap;margin-top:30px}
.btn.valset-btn{background:var(--b-accent);color:var(--b-accent-ink)}
.btn.valset-btn:hover{background:#FFE17A}
.btn.valset-btn:focus-visible{outline-color:var(--b-accent)}
.valset-copy .valset-pending{font-size:11.5px;margin-top:20px;color:#A6BDD2}
.valset-visual{margin:0;border:1px solid rgba(244,204,70,.3);background:#081C2B;box-shadow:0 24px 60px rgba(0,0,0,.25)}
.valset-art{aspect-ratio:1;overflow:hidden}
.valset-art img{width:100%;height:100%;object-fit:cover;object-position:center}
.valset-visual figcaption{display:flex;align-items:center;justify-content:space-between;padding:15px 20px;border-top:1px solid rgba(244,204,70,.2);color:var(--b-accent);font-size:10px;letter-spacing:.12em}
.valset-visual figcaption span:first-child{font:400 22px Georgia,serif;letter-spacing:.03em}
.foot-grid{grid-template-columns:1.25fr 1.25fr .8fr .8fr .8fr;gap:30px}
.foot-valset{padding:18px;margin:-18px 0 0;background:var(--b-bg);border-top:2px solid var(--b-accent)}
.foot-valset .foot-brand{color:var(--b-accent);gap:10px}
.foot-valset .foot-brand>span:last-child{font:400 23px/1.15 Georgia,serif}
.foot-valset .foot-brand small{display:block;font:8px/1.4 var(--font-body);letter-spacing:.14em;margin-top:4px;color:#BED0E0}
.foot-valset p{font-size:12.5px;color:#BED0E0}
.foot-valset-mark{display:block;width:40px;height:48px;overflow:hidden;flex-shrink:0}
.foot-valset-mark img{width:100%;height:100%;object-fit:cover}
.foot-valset a:hover{color:var(--b-accent)}
.concept-tag{font-size:10px;padding:6px 10px;bottom:12px;left:12px}
@media(max-width:1180px){.nav-links{display:none}.burger{display:flex}.foot-grid{grid-template-columns:1.2fr 1.2fr 1fr;row-gap:36px}}
@media(max-width:900px){.valset-grid{grid-template-columns:1fr;gap:36px}.valset-visual{max-width:520px;width:100%}.hero{padding-top:48px}.entry-cards{display:grid;grid-template-columns:1fr 1fr}.valset-entry-top{grid-template-columns:1fr}.valset-entry-mark{display:none}.hero-grid{gap:32px}}
@media(max-width:640px){.brand-family{gap:12px}.brand{gap:7px}.brand img{height:30px}.brand .word{font-size:16px}.valset-wordmark{padding-left:12px}.valset-wordmark strong{font-size:21px}.valset-wordmark small{font-size:6.5px}.nav{height:70px;gap:10px}.nav-right{gap:10px}.topbar{margin-top:70px;font-size:10px}.topbar .ph{font-size:9px!important}.entry-cards{grid-template-columns:1fr}.valset-entry-top{grid-template-columns:1fr 108px}.valset-entry-mark{display:block}.hero{padding-top:42px;padding-bottom:48px}.valset-section-top{font-size:9px;margin-bottom:32px}.valset-section .blk{padding:60px 0}.foot-grid{grid-template-columns:1fr 1fr;gap:32px 22px}.foot-valset{margin:0;padding:16px}.foot-grid>div:first-child{grid-column:1/-1}.foot-valset{grid-column:1/-1}.form-wrap{padding:24px}.foot-bottom{padding-bottom:26px}}
@media(max-width:380px){.brand-family{gap:8px}.valset-wordmark{padding-left:8px}.nav-right{gap:6px}.brand .word{font-size:14px}.brand img{height:27px}.valset-wordmark strong{font-size:18px}.tgl{width:46px}.tgl .dot{width:18px;height:18px}html[data-theme="light"] .tgl .dot{transform:translateX(18px)}.entry-card{padding:22px}.entry-card.b .valset-small{display:none}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{transition:none!important}}
'''
replace('</style>', css + '\n</style>', 1)
(root / 'concepts/ak-loewen-valset-konzept-v2.html').write_text(s)
print('Updated concept:', len(s.encode()), 'bytes')

# Keep the source logos available for future development; no image is regenerated.
original = (root / 'references/ak-loewen-konzept-ZWISCHENSTAND.html').read_text()
for theme in ['dark', 'light']:
    match = re.search(r'<img src="data:image/(\w+);base64,([A-Za-z0-9+/=]+)"[^>]*class="logo-img logo-' + theme + '"', original)
    assert match
    (root / f'assets/ak-loewen-{theme}.{match[1]}').write_bytes(base64.b64decode(match[2]))
