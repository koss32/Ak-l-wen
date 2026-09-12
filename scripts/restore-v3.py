"""Reproduce the archived v2 design without writing any archived project file.

Run with Python 3.11+; standard library only. This is stage 0, not release A.
"""
from pathlib import Path
import base64
import hashlib
import json
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'concepts/ak-loewen-valset-konzept-v3-functional.html'


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def restore():
    preserved = [ROOT / 'concepts/ak-loewen-valset-konzept-v2.html',
                 ROOT / 'scripts/update-concept.py']
    preserved += [p for folder in ['references', 'assets']
                  for p in (ROOT / folder).rglob('*') if p.is_file()]
    before = {str(p.relative_to(ROOT)): sha256(p) for p in preserved}
    # The original generator writes v2 and re-extracts logos. Isolate ALL writes.
    with tempfile.TemporaryDirectory(prefix='ak-loewen-restore-') as temp:
        sandbox = Path(temp)
        for folder in ['references', 'assets']:
            shutil.copytree(ROOT / folder, sandbox / folder)
        (sandbox / 'scripts').mkdir()
        (sandbox / 'concepts').mkdir()
        source = (ROOT / 'scripts/update-concept.py').read_text(encoding='utf-8')
        # Make the archived platform-dependent text IO deterministic on Windows.
        source = source.replace('.read_text()', ".read_text(encoding='utf-8')")
        source = source.replace('.write_text(s)', ".write_text(s, encoding='utf-8', newline='\\n')")
        generator = sandbox / 'scripts/update-concept.py'
        generator.write_text(source, encoding='utf-8', newline='\n')
        subprocess.run([sys.executable, str(generator)], check=True, capture_output=True)
        html = (sandbox / 'concepts/ak-loewen-valset-konzept-v2.html').read_text(encoding='utf-8')

    # A downloadable, offline review copy. No network connection or native form
    # submission is allowed. Permit only the exact existing script by its hash.
    scripts = re.findall(r'<script\b[^>]*>(.*?)</script>', html, re.S | re.I)
    assert len(scripts) == 1, 'Unexpected script structure'
    hashes = ["'sha256-" + base64.b64encode(hashlib.sha256(s.encode()).digest()).decode() + "'" for s in scripts]
    csp = ("default-src 'none'; script-src " + ' '.join(hashes)
           + "; style-src 'unsafe-inline'; img-src data:; font-src 'none';"
           + " connect-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'")
    metadata = ('\n<meta name="robots" content="noindex, nofollow, noarchive">'
                '\n<meta name="referrer" content="no-referrer">'
                '\n<meta http-equiv="Content-Security-Policy" content="' + csp + '">'
                '\n<!-- Stage 0: recovered v2 baseline. Functional release A is pending. -->')
    html = html.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">' + metadata, 1)
    if metadata not in html:
        html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">' + metadata, 1)
    assert metadata in html, 'Missing charset insertion point'
    html = html.replace('AK LÖWEN × VALSET — Design-Konzept v2',
                        'AK LÖWEN × VALSET — v3 · Wiederhergestellte Vorschau')
    html = html.replace('Konzeptstand 11.09.2026 · Version 2',
                        'Vorschau 12.09.2026 · v3 · Wiederhergestellter Stand v2')
    assert html.rstrip().endswith('</html>')
    assert '\ufffd' not in html and '\x00' not in html
    assert before == {str(p.relative_to(ROOT)): sha256(p) for p in preserved}
    if OUTPUT.exists() and OUTPUT.read_bytes() != html.encode('utf-8'):
        raise SystemExit('Refusing to overwrite a modified v3 file. Restore in a separate checkout.')
    OUTPUT.write_text(html, encoding='utf-8', newline='\n')
    print(json.dumps({'output': str(OUTPUT.relative_to(ROOT)), 'bytes': OUTPUT.stat().st_size,
                      'sha256': sha256(OUTPUT), 'preserved_files': before}, indent=2))


if __name__ == '__main__':
    restore()
